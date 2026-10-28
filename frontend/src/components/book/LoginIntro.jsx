import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CoverFront } from "../CoverBook";
import "../../styles/Form.css";

const SWING = "cubic-bezier(0.5, 0, 0.3, 1)";

// A copy of the login page as it looked the moment the login went through.
function LoginPageCopy({ login }) {
  return (
    <div className="page-form">
      <h2 className="page-form-title">Welcome back</h2>
      <p className="page-form-subtitle">log in to open your pantry</p>
      {login.registered && (
        <p className="page-form-note">All set! Now log in with your new account.</p>
      )}
      <label className="page-form-label">
        username
        <input className="ink-input" type="text" value={login.username} readOnly tabIndex={-1} />
      </label>
      <label className="page-form-label">
        password
        <input
          className="ink-input"
          type="password"
          value={"x".repeat(login.passwordLength)}
          readOnly
          tabIndex={-1}
        />
      </label>
      {/* same elements as the real form (a disabled button while logging in) */}
      <button className="ink-button page-form-button" type="button" disabled tabIndex={-1}>
        one moment…
      </button>
      <p className="page-form-switch">
        new here?{" "}
        <a href="/register" tabIndex={-1}>
          start a cookbook
        </a>
      </p>
      <button type="button" className="page-form-close" tabIndex={-1}>
        ← close the book
      </button>
    </div>
  );
}

function MiniPantry({ pantry, loadingPantry }) {
  return (
    <div className="mini-page">
      <h2>My Pantry</h2>
      <p className="mini-subtitle">what's on the shelves?</p>
      {loadingPantry ? (
        <p className="mini-note">checking the cupboards…</p>
      ) : (
        <ul>
          {pantry.slice(0, 14).map((item) => (
            <li key={item.id}>– {item.ingredient}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MiniSuggestions({ recipes }) {
  return (
    <div className="mini-page">
      <h2>Recipe ideas</h2>
      <p className="mini-subtitle">cooked up from what you have</p>
      {recipes.length ? (
        <div className="mini-polaroids">
          {recipes.slice(0, 4).map((r) => (
            <img key={r.id} src={r.image} alt="" />
          ))}
        </div>
      ) : (
        <p className="mini-note">Nothing simmering yet…</p>
      )}
    </div>
  );
}

/*
 * Plays once after logging in. It starts as an exact copy of the login
 * screen (the cookbook open at its first page), turns that page over to
 * reveal the pantry, then grows the book into the pantry spread's place
 * while the real page fades in underneath. Rendered into <body> because
 * the real layout is hidden (body.intro-hidden) until the hand-over.
 */
function LoginIntro({ login, pantry, onDone }) {
  const [phase, setPhase] = useState("turn");
  const overlayRef = useRef(null);

  useLayoutEffect(() => {
    document.body.classList.add("intro-hidden");
    return () => document.body.classList.remove("intro-hidden");
  }, []);

  useLayoutEffect(() => {
    if (phase !== "settle") return;
    const overlay = overlayRef.current;
    const layout = document.querySelector(".layout");
    const target = document.querySelector(".layout .book")?.getBoundingClientRect();
    document.body.classList.remove("intro-hidden");
    if (!target || !layout) {
      onDone();
      return;
    }

    // The open spread: cover lying flat on the left, page on the right.
    const book = overlay.querySelector(".closed-book").getBoundingClientRect();
    const from = { x: book.left - book.width, y: book.top, w: book.width * 2, h: book.height };
    const dx = target.left + target.width / 2 - (from.x + from.w / 2);
    const dy = target.top + target.height / 2 - (from.y + from.h / 2);
    overlay.style.transformOrigin = `${from.x + from.w / 2}px ${from.y + from.h / 2}px`;

    const timing = { duration: 750, easing: SWING, fill: "forwards" };
    const grow = overlay.animate(
      [
        { transform: "none" },
        {
          transform: `translate(${dx}px, ${dy}px) scale(${target.width / from.w}, ${
            target.height / from.h
          })`,
        },
      ],
      timing
    );
    const fadeOut = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
      ...timing,
      duration: 450,
      delay: 300,
    });
    const fadeIn = layout.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay: 250,
      easing: "ease",
      fill: "backwards",
    });
    fadeOut.onfinish = onDone;

    return () => {
      grow.cancel();
      fadeOut.cancel();
      fadeIn.cancel();
    };
  }, [phase, onDone]);

  const handleTurnEnd = (e) => {
    if (e.target === e.currentTarget) setPhase("settle");
  };

  return createPortal(
    <div className="home intro-overlay" ref={overlayRef} aria-hidden="true">
      <div className="closed-book is-open is-turning">
        <span className="ribbon" />

        <div className="first-page">
          <MiniSuggestions recipes={pantry.recipes} />
        </div>

        <div className="cover">
          <div className="cover-front">
            <CoverFront />
          </div>
          <div className="cover-back" />
        </div>

        <div className="page-leaf" onAnimationEnd={handleTurnEnd}>
          <div className="first-page leaf-front">
            <LoginPageCopy login={login} />
          </div>
          <div className="first-page leaf-back">
            <MiniPantry pantry={pantry.pantry} loadingPantry={pantry.loadingPantry} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default LoginIntro;
