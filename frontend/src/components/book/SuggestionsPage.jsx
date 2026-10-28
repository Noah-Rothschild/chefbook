import { Link } from "react-router-dom";

function Polaroid({ recipe }) {
  const missing = recipe.missingIngredients || [];

  return (
    <Link to={`/recipes/${recipe.id}`} className="polaroid">
      <span className="tape" aria-hidden="true" />
      <img src={recipe.image} alt="" loading="lazy" />
      <h3>{recipe.title}</h3>
      <p className="polaroid-counts">
        have {recipe.usedCount}
        {recipe.missingCount > 0 ? (
          <> · need {recipe.missingCount} more</>
        ) : (
          <> · nothing missing</>
        )}
      </p>
      {missing.length > 0 && (
        <p className="polaroid-missing">
          need: {missing.slice(0, 3).join(", ")}
          {missing.length > 3 && "…"}
        </p>
      )}
    </Link>
  );
}

function SuggestionsPage({ recipes, loadingRecipes }) {
  return (
    <div className="suggestions-page">
      <header className="page-header">
        <h2>Recipe ideas</h2>
        <p className="page-subtitle">cooked up from what you have</p>
      </header>

      {loadingRecipes ? (
        <div className="polaroid-grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="polaroid polaroid-blank" />
          ))}
        </div>
      ) : recipes.length ? (
        <div className="polaroid-grid">
          {recipes.map((recipe) => (
            <Polaroid key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="empty-note">
          <p className="empty-title">Nothing simmering yet…</p>
          <p>
            ← Write a few things in your pantry, then press <em>find recipes</em> and
            I'll pin some ideas here.
          </p>
        </div>
      )}
    </div>
  );
}

export default SuggestionsPage;
