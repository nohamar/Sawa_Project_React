import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiUser, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import "../../Navbar.css";
import logo from "../../assets/Sawa_logo.png";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

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

  const handleLogout = async () => {
    await signOut();
    closeMenu();
    navigate("/login");
  };

  const getInitial = () => {
    if (profile?.first_name?.trim()) {
      return profile.first_name.charAt(0).toUpperCase();
    }

    if (user?.email?.trim()) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  const profileLink = "/profile";

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

            {profile?.role === "volunteer" && (
              <>
                <NavLink
                  to="/saved-events"
                  className={({ isActive }) =>
                    isActive ? "navbar-link active-link" : "navbar-link"
                  }
                >
                  Saved Events
                </NavLink>

                <NavLink
                  to="/user-registrations"
                  className={({ isActive }) =>
                    isActive ? "navbar-link active-link" : "navbar-link"
                  }
                >
                  My Registrations
                </NavLink>
              </>
            )}

            {profile?.role === "organizer" && (
              <>
                <NavLink
                  to="/organizer-dashboard"
                  className={({ isActive }) =>
                    isActive ? "navbar-link active-link" : "navbar-link"
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/organizer-dashboard/create-event"
                  className={({ isActive }) =>
                    isActive ? "navbar-link active-link" : "navbar-link"
                  }
                >
                  Create Event
                </NavLink>
              </>
            )}
          </div>

          <div className="navbar-right">
            {!user || !profile ? (
              <>
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
              </>
            ) : (
              <>
                <Link
                  to={profileLink}
                  className="navbar-profile-circle desktop-btn"
                  aria-label="Profile"
                > {profile.avatar ? (
                  <img
                  src={profile.avatar}
                  alt="Profile avatar"
                  className="navbar-profile-image" />
                ) : ( getInitial()
               ) }
                </Link>

                <button
                  className="navbar-logout-btn desktop-btn"
                  onClick={handleLogout}
                  type="button"
                >
                  <FiLogOut className="auth-icon" />
                  Logout
                </button>

                <Link
                  to={profileLink}
                  className="icon-btn tablet-only navbar-profile-icon-btn"
                  aria-label="Profile"
                >
                  {getInitial()}
                </Link>
              </>
            )}

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
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className="mobile-menu-link"
            >
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

            {!user || !profile ? (
              <NavLink
                to="/login"
                onClick={closeMenu}
                className="mobile-menu-link"
              >
                Register / Login
              </NavLink>
            ) : (
              <>
                {profile.role === "volunteer" && (
                  <>
                    <NavLink
                      to="/saved-events"
                      onClick={closeMenu}
                      className="mobile-menu-link"
                    >
                      Saved Events
                    </NavLink>

                    <NavLink
                      to="/user-registrations"
                      onClick={closeMenu}
                      className="mobile-menu-link"
                    >
                      My Registrations
                    </NavLink>
                  </>
                )}

                {profile.role === "organizer" && (
                  <>
                    <NavLink
                      to="/organizer-dashboard"
                      onClick={closeMenu}
                      className="mobile-menu-link"
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/organizer-dashboard/create-event"
                      onClick={closeMenu}
                      className="mobile-menu-link"
                    >
                      Create Event
                    </NavLink>
                  </>
                )}

                <NavLink
                  to={profileLink}
                  onClick={closeMenu}
                  className="mobile-menu-link"
                >
                  Profile
                </NavLink>

                <button
                  type="button"
                  className="mobile-menu-link mobile-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
