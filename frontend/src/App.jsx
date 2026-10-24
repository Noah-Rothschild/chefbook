import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pantry from "./pages/Pantry";
import RecipeDetail from "./pages/RecipeDetail";
import Recipes from "./pages/Recipes";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function Logout() {
  localStorage.clear();
  sessionStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pantry" element={<Protected><Pantry /></Protected>} />
        <Route path="/recipes" element={<Protected><Recipes /></Protected>} />
        <Route path="/recipes/:id" element={<Protected><RecipeDetail /></Protected>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
