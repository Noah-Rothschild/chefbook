import { NavLink, Link } from "react-router-dom";
import "../styles/Layout.css";

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="navbar">
        <Link to="/pantry" className="navbar-brand" aria-label="Chefbook home">
          <img src="/logo-olive.png" alt="Chefbook" />
        </Link>

        <nav className="navbar-links">
          <NavLink to="/pantry">Pantry</NavLink>
          <NavLink to="/recipes" end>
            Saved Recipes
          </NavLink>
          <span className="navbar-soon" title="Coming soon">
            AI Kitchen <small>soon</small>
          </span>
        </nav>

        <Link to="/logout" className="navbar-logout">
          Log out
        </Link>
      </header>

      <main className="layout-main">{children}</main>
    </div>
  );
}

export default Layout;
