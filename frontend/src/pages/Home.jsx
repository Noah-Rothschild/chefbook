import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CoverBook, { CoverFront } from "../components/CoverBook";
import { prefersReducedMotion } from "../motion";
import Form from "../components/Form";

// What's written on the first page while the cover swings open; it matches
// the page we're heading to, so arriving there changes nothing on screen.
function FirstPage({ target }) {
  if (target === "/login") return <Form route="/chefbook/token/" method="login" />;
  if (target === "/register") return <Form route="/chefbook/user/register/" method="register" />;
  if (target === "/pantry") return <p className="first-page-note">turning to your pantry…</p>;
  return null;
}

function Home() {
  const navigate = useNavigate();
  const [target, setTarget] = useState(null);

  const open = (e, to) => {
    e.preventDefault();
    if (target) return;
    if (prefersReducedMotion()) navigate(to);
    else setTarget(to);
  };

  return (
    <CoverBook
      state={target ? "opening" : "closed"}
      front={<CoverFront onOpen={open} />}
      page={<FirstPage target={target} />}
      onSwingEnd={() => navigate(target)}
    />
  );
}

export default Home;
