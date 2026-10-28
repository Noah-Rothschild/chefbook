import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cookbook from "./pages/Cookbook";
import Recipes from "./pages/Recipes";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Backdrop from "./components/Backdrop";

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
      <Backdrop />
      <Routes>
        {/* One Cookbook stays mounted across both paths so the page can turn */}
        <Route element={<Protected><Cookbook /></Protected>}>
          <Route path="/pantry" element={null} />
          <Route path="/recipes/:id" element={null} />
        </Route>
        <Route path="/recipes" element={<Protected><Recipes /></Protected>} />
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
