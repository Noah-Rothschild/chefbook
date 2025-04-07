import { Link } from "react-router-dom";

export function ButtonLink({ to, children }) {
  return (
    <Link to={to}>
      <button>{children}</button>
    </Link>
  );
}
