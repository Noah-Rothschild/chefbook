import { useState } from "react";
import api from "../api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function errorMessage(error, isLogin) {
  const data = error.response?.data;
  if (!data) return "Can't reach Chefbook right now. Please try again.";
  if (isLogin) return "That username and password don't match.";
  const first = Object.values(data).flat()[0];
  return typeof first === "string" ? first : "Something went wrong. Please try again.";
}

// The login / register form, written on the first page of the cookbook.
// `onClose` swings the cover shut again.
function Form({ route, method, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const isLogin = method === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post(route, { username, password });
      if (isLogin) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        // The pantry turns this page over, so tell it what the page looked like.
        navigate("/pantry", {
          state: {
            fromLogin: {
              username,
              passwordLength: password.length,
              registered: Boolean(state?.registered),
            },
          },
        });
      } else {
        navigate("/login", { state: { registered: true } });
      }
    } catch (err) {
      setError(errorMessage(err, isLogin));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="page-form">
      <h2 className="page-form-title">{isLogin ? "Welcome back" : "This cookbook belongs to…"}</h2>
      <p className="page-form-subtitle">
        {isLogin ? "log in to open your pantry" : "pick a name and a password to start"}
      </p>

      {isLogin && state?.registered && (
        <p className="page-form-note">All set! Now log in with your new account.</p>
      )}

      <label className="page-form-label">
        {isLogin ? "username" : "your name"}
        <input
          className="ink-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </label>

      <label className="page-form-label">
        password
        <input
          className="ink-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
        />
      </label>

      {error && <p className="ink-error">{error}</p>}

      <button className="ink-button page-form-button" type="submit" disabled={loading}>
        {loading ? "one moment…" : isLogin ? "log in →" : "start my cookbook →"}
      </button>

      <p className="page-form-switch">
        {isLogin ? (
          <>
            new here? <Link to="/register">start a cookbook</Link>
          </>
        ) : (
          <>
            already have one? <Link to="/login">log in</Link>
          </>
        )}
      </p>

      <button type="button" className="page-form-close" onClick={onClose}>
        ← close the book
      </button>
    </form>
  );
}

export default Form;
