import { useEffect, useMemo, useState } from "react";
import api from "../api";
import RecipeCard from "../components/RecipeCard";
import "../styles/Pantry.css";

const RECIPES_KEY = "chefbook-suggestions";

function loadSavedRecipes() {
  try {
    return JSON.parse(sessionStorage.getItem(RECIPES_KEY)) || [];
  } catch {
    return [];
  }
}

function Pantry() {
  const [pantry, setPantry] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [loadingPantry, setLoadingPantry] = useState(true);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
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

  const categoryOf = useMemo(() => {
    const map = {};
    allIngredients.forEach((ing) => (map[ing.name] = ing.category));
    return map;
  }, [allIngredients]);

  const pantryNames = useMemo(() => new Set(pantry.map((item) => item.ingredient)), [pantry]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allIngredients
      .filter((ing) => ing.name.toLowerCase().includes(q) && !pantryNames.has(ing.name))
      .slice(0, 6);
  }, [query, allIngredients, pantryNames]);

  const grouped = useMemo(() => {
    const groups = {};
    pantry.forEach((item) => {
      const category = categoryOf[item.ingredient] || "Other";
      (groups[category] ||= []).push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [pantry, categoryOf]);

  const handleSelect = async (ingredient) => {
    setError("");
    setQuery("");
    setHighlight(0);
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

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(suggestions[highlight] || suggestions[0]);
    } else if (e.key === "Escape") {
      setQuery("");
    }
  };

  const handleDelete = async (id) => {
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

  return (
    <div className="pantry-page">
      <section className="pantry-panel card">
        <header className="panel-header">
          <h1>Your Pantry</h1>
          <p className="hand">what's on the shelves?</p>
        </header>

        <div className="pantry-search">
          <input
            className="input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Add an ingredient, e.g. garlic"
            aria-label="Search ingredients to add"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions" role="listbox">
              {suggestions.map((item, i) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={i === highlight}
                  className={i === highlight ? "is-active" : ""}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
                >
                  <span>{item.name}</span>
                  <small>{item.category}</small>
                </li>
              ))}
            </ul>
          )}
          {query.trim() && suggestions.length === 0 && allIngredients.length > 0 && (
            <p className="search-empty">No matching ingredients</p>
          )}
        </div>

        {error && <p className="notice">{error}</p>}

        <div className="pantry-list">
          {loadingPantry ? (
            <p className="muted">Checking the cupboards…</p>
          ) : pantry.length === 0 ? (
            <p className="pantry-empty">
              Your pantry is empty. Start typing above to stock it up.
            </p>
          ) : (
            grouped.map(([category, items]) => (
              <div key={category} className="pantry-group">
                <h4>{category}</h4>
                <ul>
                  {items.map((item) => (
                    <li key={item.id} className="chip">
                      <span>{item.ingredient}</span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        aria-label={`Remove ${item.ingredient}`}
                        title="Remove"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <footer className="panel-footer">
          <span className="muted">
            {pantry.length} {pantry.length === 1 ? "ingredient" : "ingredients"}
          </span>
          <button
            className="btn"
            onClick={fetchRecipes}
            disabled={pantry.length === 0 || loadingRecipes}
          >
            {loadingRecipes ? "Searching…" : "Find recipes"}
          </button>
        </footer>
      </section>

      <section className="recipes-panel">
        <header className="panel-header">
          <h2>Recipe ideas</h2>
          <p className="hand">cooked up from what you have</p>
        </header>

        {loadingRecipes ? (
          <div className="recipe-grid">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="recipe-card card skeleton" />
            ))}
          </div>
        ) : recipes.length ? (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="recipes-empty card">
            <p className="hand">Nothing simmering yet…</p>
            <p>Add a few ingredients to your pantry, then press “Find recipes”.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Pantry;
