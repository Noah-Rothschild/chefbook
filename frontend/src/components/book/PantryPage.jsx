import { useMemo, useState } from "react";

function PantryPage({
  allIngredients,
  pantryNames,
  grouped,
  pantry,
  loadingPantry,
  error,
  addIngredient,
  removeIngredient,
  fetchRecipes,
  loadingRecipes,
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allIngredients
      .filter((ing) => ing.name.toLowerCase().includes(q) && !pantryNames.has(ing.name))
      .slice(0, 6);
  }, [query, allIngredients, pantryNames]);

  const select = (ingredient) => {
    setQuery("");
    setHighlight(0);
    addIngredient(ingredient);
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
      select(suggestions[highlight] || suggestions[0]);
    } else if (e.key === "Escape") {
      setQuery("");
    }
  };

  return (
    <div className="pantry-page">
      <header className="page-header">
        <h1>My Pantry</h1>
        <p className="page-subtitle">what's on the shelves?</p>
      </header>

      <div className="pantry-search">
        <input
          className="ink-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="jot down an ingredient…"
          aria-label="Search ingredients to add"
        />
        {suggestions.length > 0 && (
          <ul className="sticky-note" role="listbox">
            {suggestions.map((item, i) => (
              <li
                key={item.id}
                role="option"
                aria-selected={i === highlight}
                className={i === highlight ? "is-active" : ""}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(item);
                }}
              >
                <span>{item.name}</span>
                <small>{item.category}</small>
              </li>
            ))}
          </ul>
        )}
        {query.trim() && suggestions.length === 0 && allIngredients.length > 0 && (
          <p className="pencil-note">no matching ingredients</p>
        )}
      </div>

      {error && <p className="ink-error">{error}</p>}

      {loadingPantry ? (
        <p className="pencil-note">checking the cupboards…</p>
      ) : pantry.length === 0 ? (
        <p className="pencil-note">
          Nothing written down yet. Start typing above to stock your pantry.
        </p>
      ) : (
        <div className="pantry-groups">
          {grouped.map(([category, items]) => (
            <section key={category} className="pantry-group">
              <h3>{category}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <span>{item.ingredient}</span>
                    <button
                      onClick={() => removeIngredient(item.id)}
                      aria-label={`Remove ${item.ingredient}`}
                      title="Cross off"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <footer className="pantry-footer">
        <span className="pencil-note">
          {pantry.length} {pantry.length === 1 ? "thing" : "things"} in the cupboard
        </span>
        <button
          className="ink-button"
          onClick={fetchRecipes}
          disabled={pantry.length === 0 || loadingRecipes}
        >
          {loadingRecipes ? "searching…" : "find recipes →"}
        </button>
      </footer>
    </div>
  );
}

export default PantryPage;
