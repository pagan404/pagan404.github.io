import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <div className="nav-links">
      <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
        Home
      </NavLink>
      <NavLink
        to="/articles"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Articles
      </NavLink>
      <NavLink
        to="/encodings"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Encodings
      </NavLink>
      <NavLink
        to="/workshop"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Workshop
      </NavLink>
    </div>
  );
}

export default Navigation;
