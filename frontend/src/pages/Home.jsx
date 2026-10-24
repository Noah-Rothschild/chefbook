import { Link } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import "../styles/Home.css";

function Home() {
  const loggedIn = Boolean(localStorage.getItem(ACCESS_TOKEN));

  return (
    <div className="home">
      <section className="home-card card">
        <img src="/logo-olive.png" alt="Chefbook" className="home-logo" />
        <p className="hand home-tagline">cook with what you've got</p>
        <p className="home-text">
          Keep track of what's in your pantry and let Chefbook suggest recipes you can
          make tonight, no extra shopping trip needed.
        </p>

        <div className="home-actions">
          {loggedIn ? (
            <Link to="/pantry" className="btn">
              Go to my pantry
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn">
                Get started
              </Link>
              <Link to="/login" className="btn btn-outline">
                Log in
              </Link>
            </>
          )}
        </div>

        <ol className="home-steps">
          <li>
            <span>1</span> Stock your pantry
          </li>
          <li>
            <span>2</span> Find recipes
          </li>
          <li>
            <span>3</span> Get cooking
          </li>
        </ol>
      </section>
    </div>
  );
}

export default Home;
