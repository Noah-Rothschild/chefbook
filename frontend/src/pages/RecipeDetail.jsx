import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../api";
import "../styles/RecipeDetail.css";

function shortSummary(text, sentences = 2) {
  if (!text) return "";
  const parts = text.match(/[^.!?]+[.!?]+/g) || [text];
  return parts.slice(0, sentences).join(" ").trim();
}

function RecipeDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const preview = state?.recipe;
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/recipes/${id}/`);
        setRecipe(res.data);
      } catch (err) {
        console.log(err);
        setError(
          err.response?.status === 404
            ? "We couldn't find that recipe."
            : "We couldn't load this recipe right now. Please try again."
        );
      }
    };
    load();
  }, [id]);

  const title = recipe?.title || preview?.title;
  const image = recipe?.image || preview?.image;
  const haveCount = recipe?.ingredients.filter((i) => i.inPantry).length;

  if (error && !preview) {
    return (
      <article className="recipe-detail">
        <Link to="/pantry" className="back-link">
          ← Back to pantry
        </Link>
        <section className="card recipe-missing">
          <p className="hand">oh, crumbs…</p>
          <p className="notice">{error}</p>
        </section>
      </article>
    );
  }

  return (
    <article className="recipe-detail">
      <Link to="/pantry" className="back-link">
        ← Back to pantry
      </Link>

      <section className="recipe-hero card">
        <div className="recipe-hero-image">
          {image && <img src={image} alt={title} />}
        </div>
        <div className="recipe-hero-text">
          <p className="hand">from the chefbook</p>
          <h1>{title || "Loading recipe…"}</h1>

          {recipe && (
            <>
              <ul className="recipe-meta">
                {recipe.readyInMinutes && (
                  <li>
                    <strong>{recipe.readyInMinutes}</strong> min
                  </li>
                )}
                {recipe.servings && (
                  <li>
                    <strong>{recipe.servings}</strong> servings
                  </li>
                )}
                <li>
                  <strong>
                    {haveCount}/{recipe.ingredients.length}
                  </strong>{" "}
                  in your pantry
                </li>
              </ul>

              {recipe.diets.length > 0 && (
                <ul className="recipe-tags">
                  {recipe.diets.map((diet) => (
                    <li key={diet}>{diet}</li>
                  ))}
                </ul>
              )}

              {recipe.summary && <p className="recipe-summary">{shortSummary(recipe.summary)}</p>}

              <div className="recipe-actions">
                <button className="btn" disabled title="Saving recipes is coming soon">
                  ♡ Save recipe
                </button>
                {recipe.sourceUrl && (
                  <a
                    className="btn btn-outline"
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Original recipe
                  </a>
                )}
              </div>
            </>
          )}

          {error && <p className="notice">{error}</p>}
        </div>
      </section>

      {recipe && (
        <div className="recipe-body">
          <section className="recipe-ingredients card">
            <h2>Ingredients</h2>
            <p className="legend">
              <span className="dot dot-have" /> in your pantry
              <span className="dot dot-need" /> to pick up
            </p>
            <ul>
              {recipe.ingredients.map((ing, i) => (
                <li key={`${ing.id}-${i}`} className={ing.inPantry ? "have" : "need"}>
                  <span className={`dot ${ing.inPantry ? "dot-have" : "dot-need"}`} />
                  {ing.original}
                </li>
              ))}
            </ul>
          </section>

          <section className="recipe-steps card">
            <h2>Method</h2>
            {recipe.steps.length ? (
              <ol>
                {recipe.steps.map((step, i) => (
                  <li key={i}>
                    <span className="step-number">{i + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="muted">
                No step-by-step method for this one.{" "}
                {recipe.sourceUrl && (
                  <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                    See the original recipe
                  </a>
                )}
              </p>
            )}
          </section>
        </div>
      )}
    </article>
  );
}

export default RecipeDetail;
