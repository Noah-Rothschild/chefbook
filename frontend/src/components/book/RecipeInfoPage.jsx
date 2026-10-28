import { Link } from "react-router-dom";

function RecipeInfoPage({ recipe, preview, error }) {
  const title = recipe?.title || preview?.title;
  const image = recipe?.image || preview?.image;
  const haveCount = recipe?.ingredients.filter((i) => i.inPantry).length;

  return (
    <div className="recipe-info-page">
      <Link to="/pantry" className="back-to-pantry">
        ← back to my pantry
      </Link>

      {error && !title ? (
        <div className="empty-note">
          <p className="empty-title">oh, crumbs…</p>
          <p className="ink-error">{error}</p>
        </div>
      ) : (
        <>
          {image && (
            <figure className="polaroid polaroid-hero">
              <span className="tape" aria-hidden="true" />
              <img src={image} alt={title} />
            </figure>
          )}

          <h1 className="recipe-title">{title || "turning to the recipe…"}</h1>

          {error && <p className="ink-error">{error}</p>}

          {recipe && (
            <>
              <p className="recipe-meta">
                {recipe.readyInMinutes && <span>{recipe.readyInMinutes} min</span>}
                {recipe.servings && <span>serves {recipe.servings}</span>}
                <span>
                  {haveCount} of {recipe.ingredients.length} in my pantry
                </span>
              </p>

              {recipe.diets.length > 0 && (
                <ul className="diet-tags">
                  {recipe.diets.map((diet) => (
                    <li key={diet}>{diet}</li>
                  ))}
                </ul>
              )}

              <h2>Ingredients</h2>
              <ul className="ingredient-list">
                {recipe.ingredients.map((ing, i) => (
                  <li key={`${ing.id}-${i}`} className={ing.inPantry ? "have" : "need"}>
                    <span className="tick" aria-label={ing.inPantry ? "in pantry" : "to pick up"}>
                      {ing.inPantry ? "✓" : "○"}
                    </span>
                    {ing.original}
                  </li>
                ))}
              </ul>
              <p className="pencil-note">✓ in my pantry &nbsp; ○ to pick up</p>
            </>
          )}

          {!recipe && !error && <p className="pencil-note">reading the recipe…</p>}
        </>
      )}
    </div>
  );
}

export default RecipeInfoPage;
