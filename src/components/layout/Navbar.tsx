import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import "../../Navbar.css";
import logo from "../../assets/Sawa_logo.png";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="navbar-wrapper">
        <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
          <div className="navbar-left">
            <Link to="/" className="navbar-logo-link" onClick={closeMenu}>
              <img src={logo} alt="website logo" className="navbar-logo" />
            </Link>
          </div>

          <div className="navbar-center desktop-only">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "navbar-link active-link" : "navbar-link"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive ? "navbar-link active-link" : "navbar-link"
              }
            >
              Events
            </NavLink>

            <NavLink
              to="/aboutus"
              className={({ isActive }) =>
                isActive ? "navbar-link active-link" : "navbar-link"
              }
            >
              About Us
            </NavLink>
          </div>

          <div className="navbar-right">
            <Link to="/login" className="navbar-auth-btn desktop-btn">
              <FiUser className="auth-icon" />
              Register/Login
            </Link>

            <Link
              to="/login"
              className="icon-btn tablet-only"
              aria-label="Register/Login"
            >
              <FiUser />
            </Link>

            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
      >
        <div
          className={`mobile-menu-panel ${menuOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-menu-top">
            <Link to="/" className="mobile-logo-link" onClick={closeMenu}>
              <img src={logo} alt="website logo" className="mobile-logo" />
            </Link>

            <button
              className="mobile-close-btn"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          <div className="mobile-menu-links">
            <NavLink to="/" end onClick={closeMenu} className="mobile-menu-link">
              Home
            </NavLink>

            <NavLink
              to="/events"
              onClick={closeMenu}
              className="mobile-menu-link"
            >
              Events
            </NavLink>

            <NavLink
              to="/aboutus"
              onClick={closeMenu}
              className="mobile-menu-link"
            >
              About Us
            </NavLink>

            <NavLink
              to="/login"
              onClick={closeMenu}
              className="mobile-menu-link"
            >
              Register / Login
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;