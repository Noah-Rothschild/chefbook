import { useEffect, useMemo, useState } from "react";
import api from "../api";

const RECIPES_KEY = "chefbook-suggestions";

function loadSavedRecipes() {
  try {
    return JSON.parse(sessionStorage.getItem(RECIPES_KEY)) || [];
  } catch {
    return [];
  }
}

// Pantry contents, the ingredient catalogue and recipe suggestions,
// shared by both pages of the pantry spread.
function usePantry() {
  const [pantry, setPantry] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [loadingPantry, setLoadingPantry] = useState(true);
  const [recipes, setRecipes] = useState(loadSavedRecipes);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [pantryRes, ingredientsRes] = await Promise.all([
          api.get("/api/pantry-ingredients/"),
          api.get("/api/ingredients/"),
        ]);
        setPantry(pantryRes.data);
        setAllIngredients(ingredientsRes.data);
      } catch (err) {
        console.log(err);
        setError("We couldn't load your pantry. Please refresh the page.");
      } finally {
        setLoadingPantry(false);
      }
    };
    load();
  }, []);

  const pantryNames = useMemo(() => new Set(pantry.map((item) => item.ingredient)), [pantry]);

  const grouped = useMemo(() => {
    const categoryOf = {};
    allIngredients.forEach((ing) => (categoryOf[ing.name] = ing.category));
    const groups = {};
    pantry.forEach((item) => {
      const category = categoryOf[item.ingredient] || "Other";
      (groups[category] ||= []).push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [pantry, allIngredients]);

  const addIngredient = async (ingredient) => {
    setError("");
    try {
      const res = await api.post("/api/pantry-ingredients/", {
        ingredient: ingredient.name,
      });
      setPantry((prev) => [...prev, res.data]);
    } catch (err) {
      console.log(err);
      setError(`Couldn't add ${ingredient.name}. Please try again.`);
    }
  };

  const removeIngredient = async (id) => {
    setError("");
    try {
      await api.delete(`/api/pantry-ingredients/${id}/`);
      setPantry((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
      setError("Couldn't remove that ingredient. Please try again.");
    }
  };

  const fetchRecipes = async () => {
    setError("");
    setLoadingRecipes(true);
    try {
      const response = await api.post("/api/recipe-suggestion/", {
        ingredients: pantry.map((item) => item.ingredient),
      });
      setRecipes(response.data);
      sessionStorage.setItem(RECIPES_KEY, JSON.stringify(response.data));
    } catch (err) {
      console.error("Error fetching recipes", err);
      setError("We couldn't find recipes right now. Please try again in a moment.");
    } finally {
      setLoadingRecipes(false);
    }
  };

  return {
    pantry,
    allIngredients,
    pantryNames,
    grouped,
    loadingPantry,
    error,
    addIngredient,
    removeIngredient,
    recipes,
    loadingRecipes,
    fetchRecipes,
  };
}

export default usePantry;
