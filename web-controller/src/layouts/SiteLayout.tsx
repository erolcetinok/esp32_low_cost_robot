import { NavLink, Outlet } from "react-router-dom";

export function SiteLayout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <NavLink className="site-brand" to="/" end>
            <strong>ESP32 Low Cost Robot</strong>
            <span>Classroom robot · Blockly · Bluetooth</span>
          </NavLink>
          <nav className="site-nav" aria-label="Site">
            <NavLink className={({ isActive }) => (isActive ? "site-nav-active" : "")} to="/" end>
              Home
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? "site-nav-active" : "")} to="/docs">
              Docs
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? "site-nav-active" : "")} to="/studio">
              Studio
            </NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
