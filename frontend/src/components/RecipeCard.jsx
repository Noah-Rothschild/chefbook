import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  const missing = recipe.missingIngredients || [];

  return (
    <Link to={`/recipes/${recipe.id}`} state={{ recipe }} className="recipe-card card">
      <div className="recipe-card-image">
        <img src={recipe.image} alt="" loading="lazy" />
      </div>
      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>
        <div className="recipe-card-pills">
          <span className="pill pill-have">You have {recipe.usedCount}</span>
          {recipe.missingCount > 0 ? (
            <span className="pill pill-need">Need {recipe.missingCount} more</span>
          ) : (
            <span className="pill pill-ready">Ready to cook</span>
          )}
        </div>
        {missing.length > 0 && (
          <p className="recipe-card-missing">
            <em>Missing:</em> {missing.slice(0, 4).join(", ")}
            {missing.length > 4 && "…"}
          </p>
        )}
      </div>
    </Link>
  );
}

export default RecipeCard;
