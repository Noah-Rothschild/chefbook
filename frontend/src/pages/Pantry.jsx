import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "../api";
import "../styles/Pantry.css";

function Pantry() {
  const [pantry, setPantry] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [pantryId, setPantryId] = useState(null);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const res = await api.get("/api/pantry-ingredients/");
        setPantry(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPantry();
    console.log(pantry);
  }, []);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await api.get("/api/ingredients/");
        setAllIngredients(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchIngredients();
  }, []);

  const getPantryId = async () => {
    try {
      const res = await api.get("api/pantry/");
      console.log(res.data);
      const pantryId = res.data[0].id;
      setPantryId(pantryId);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPantryId();
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    const filteredResults = allIngredients.filter((ing) =>
      ing.name.toLowerCase().includes(val.toLowerCase())
    );
    setFiltered(filteredResults.slice(0, 5));
  };

  const handleSelect = async (ingredient) => {
    if (!pantryId) {
      console.log("no pantry ID");
      return;
    }

    try {
      const res = await api.post("/api/pantry-ingredients/", {
        pantry: pantryId,
        ingredient: ingredient.name,
      });
      setPantry([...pantry, res.data]);
      setQuery("");
      setFiltered([]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/pantry-ingredients/${id}/`);
      setPantry(pantry.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRecipes = async () => {
    try {
      const ingredientNames = pantry
        .map((item) => item.ingredient.name || item.ingredient)
        .join(",");

      const response = await api.post("/api/recipe-suggestion/", {
        ingredients: ingredientNames,
      });

      console.log("Suggested recipes:", response.data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  };

  return (
    <div>
      <img
        src="/logo.png"
        alt="Chefbook Logo"
        style={{ width: "120px", marginBottom: "20px" }}
      />
      <div className="page-wrapper">
        <h1 className="header">Your Pantry</h1>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Type to add ingredient..."
        />
        <ul>
          {filtered.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{ cursor: "pointer" }}
            >
              {item.name}
            </li>
          ))}
        </ul>
        <ul>
          {pantry.length > 0 ? (
            pantry.map((item) => {
              const ingredient = item?.ingredient;

              if (!ingredient) return null;

              return (
                <li key={item.id} className="ingredientList">
                  <span>{ingredient} </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="deleteButton"
                  >
                    delete
                  </button>
                </li>
              );
            })
          ) : (
            <li>No ingredients in your pantry yet!</li>
          )}
        </ul>

        <button onClick={fetchRecipes}>Get Recipe Suggestions</button>
      </div>
    </div>
  );
}

export default Pantry;
