import { Link } from "react-router-dom";

function Recipes() {
  return (
    <section className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
      <h1>Saved Recipes</h1>
      <p className="hand">coming soon</p>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        Soon you'll be able to keep your favourite recipes here.
      </p>
      <Link to="/pantry" className="btn">
        Back to my pantry
      </Link>
    </section>
  );
}

export default Recipes;
