import { Link } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import "../styles/Cover.css";

// The front of the cookbook: embossed logo, paper label and the buttons
// that open it. `onOpen(event, path)` is called when one is clicked.
export function CoverFront({ onOpen }) {
  const loggedIn = Boolean(localStorage.getItem(ACCESS_TOKEN));
  const open = (to) => (e) => onOpen?.(e, to);

  return (
    <>
      <span className="cover-stitch" aria-hidden="true" />
      <span className="cover-corner cover-corner-top" aria-hidden="true" />
      <span className="cover-corner cover-corner-bottom" aria-hidden="true" />

      <h1 className="cover-title">
        <img src="/logo-gold.png" alt="Chefbook" />
      </h1>

      <div className="cover-label">
        <p className="cover-tagline">cook with what you've got</p>
        <p className="cover-steps">stock your pantry · find recipes · get cooking</p>
      </div>

      <div className="cover-actions">
        {loggedIn ? (
          <Link to="/pantry" className="cover-button" onClick={open("/pantry")}>
            open my cookbook
          </Link>
        ) : (
          <>
            <Link to="/register" className="cover-button" onClick={open("/register")}>
              get started
            </Link>
            <Link to="/login" className="cover-link" onClick={open("/login")}>
              I already have an account
            </Link>
          </>
        )}
      </div>
    </>
  );
}

/*
 * The cookbook seen from above, shared by the start, login and register
 * screens so moving between them never redraws the scene.
 * state: "closed" | "opening" | "open" | "closing". When an opening or
 * closing swing finishes, onSwingEnd is called.
 * Every screen renders the same element tree here, so the book sits in
 * exactly the same place whichever page draws it.
 */
function CoverBook({ state, front, page, onSwingEnd }) {
  const handleAnimationEnd = (e) => {
    if (e.target === e.currentTarget && onSwingEnd) onSwingEnd();
  };

  return (
    <div className="home">
      <div className={`closed-book is-${state}`}>
        <span className="ribbon" aria-hidden="true" />

        <div className="first-page" inert={state === "closed" ? true : undefined}>
          {page}
        </div>

        <div className="cover" onAnimationEnd={handleAnimationEnd}>
          <div className="cover-front" inert={state === "open" ? true : undefined}>
            {front}
          </div>
          <div className="cover-back" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default CoverBook;
