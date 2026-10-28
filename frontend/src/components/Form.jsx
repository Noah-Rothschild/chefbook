import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function errorMessage(error, isLogin) {
  const data = error.response?.data;
  if (!data) return "Can't reach Chefbook right now. Please try again.";
  if (isLogin) return "That username and password don't match.";
  const first = Object.values(data).flat()[0];
  return typeof first === "string" ? first : "Something went wrong. Please try again.";
}

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isLogin = method === "login";
  const name = isLogin ? "Log in" : "Create account";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post(route, { username, password });
      if (isLogin) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/pantry");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(errorMessage(err, isLogin));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container card">
        <Link to="/" aria-label="Chefbook home">
          <img src="/logo-olive.png" alt="Chefbook" className="form-logo" />
        </Link>
        <h1 className="form-title">{name}</h1>
        <p className="hand form-subtitle">
          {isLogin ? "welcome back to the kitchen" : "pull up a chair"}
        </p>

        <label className="form-label">
          Username
          <input
            className="input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="form-label">
          Password
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
          />
        </label>

        {error && <p className="notice">{error}</p>}

        <button className="btn form-button" type="submit" disabled={loading}>
          {loading ? "One moment…" : name}
        </button>

        <p className="form-footer">
          {isLogin ? (
            <>
              New here? <Link to="/register">Create an account</Link>
            </>
          ) : (
            <>
              Already have an account? <Link to="/login">Log in</Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}

export default Form;
