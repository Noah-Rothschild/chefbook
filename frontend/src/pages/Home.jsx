import { href, Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <header>
        <h1>Chefbook</h1>
        <p>Insert Slogan</p>
      </header>

      <section className="Buttons">
        <Link to="/register">
          <button>Get Started</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </section>
    </div>
  );
}

export default Home;
