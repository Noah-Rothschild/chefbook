import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CoverBook, { CoverFront } from "../components/CoverBook";
import { prefersReducedMotion } from "../motion";
import Form from "../components/Form";

// Login and register: the cookbook lying open at its first page, exactly
// where the start screen's cover swing leaves it. "Close the book" swings
// the cover shut and returns to the start screen.
function AuthPage({ route, method }) {
  const navigate = useNavigate();
  const [closing, setClosing] = useState(false);

  const close = () => {
    if (prefersReducedMotion()) navigate("/");
    else setClosing(true);
  };

  return (
    <CoverBook
      state={closing ? "closing" : "open"}
      front={<CoverFront />}
      page={<Form route={route} method={method} onClose={close} />}
      onSwingEnd={() => navigate("/")}
    />
  );
}

export default AuthPage;
