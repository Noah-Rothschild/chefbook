function shortSummary(text, sentences = 2) {
  if (!text) return "";
  const parts = text.match(/[^.!?]+[.!?]+/g) || [text];
  return parts.slice(0, sentences).join(" ").trim();
}

function RecipeMethodPage({ recipe }) {
  if (!recipe) {
    return <div className="recipe-method-page" />;
  }

  return (
    <div className="recipe-method-page">
      {recipe.summary && (
        <aside className="sticky-note recipe-note">
          <strong>Notes:</strong> {shortSummary(recipe.summary)}
        </aside>
      )}

      <h2>Method</h2>
      {recipe.steps.length ? (
        <ol className="method-steps">
          {recipe.steps.map((step, i) => (
            <li key={i}>
              <span className="step-number">{i + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="pencil-note">No step-by-step method written down for this one.</p>
      )}

      <div className="recipe-actions">
        <button className="ink-button" disabled title="Saving recipes is coming soon">
          ♡ save recipe <small>(soon)</small>
        </button>
        {recipe.sourceUrl && (
          <a
            className="ink-link"
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            original recipe ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default RecipeMethodPage;
