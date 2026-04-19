import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiUser, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import styles from "../../css/Navbar.module.css";
import logo from "../../assets/Sawa_logo.png";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

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
      <header className={styles.navbarWrapper}>
        <nav className={styles.navbar}>
          <div className={styles.navbarLeft}>
            <Link
              to="/"
              className={styles.navbarLogoLink}
              onClick={closeMenu}
            >
              <img
                src={logo}
                alt="website logo"
                className={styles.navbarLogo}
              />
            </Link>
          </div>

          <div className={`${styles.navbarCenter} ${styles.desktopOnly}`}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? `${styles.navbarLink} ${styles.activeLink}`
                  : styles.navbarLink
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navbarLink} ${styles.activeLink}`
                  : styles.navbarLink
              }
            >
              Events
            </NavLink>

            <NavLink
              to="/aboutus"
              className={({ isActive }) =>
                isActive
                  ? `${styles.navbarLink} ${styles.activeLink}`
                  : styles.navbarLink
              }
            >
              About Us
            </NavLink>

            {profile?.role === "volunteer" && (
              <>
                <NavLink
                  to="/saved-events"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.activeLink}`
                      : styles.navbarLink
                  }
                >
                  Saved
                </NavLink>

                <NavLink
                  to="/user-registrations"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.activeLink}`
                      : styles.navbarLink
                  }
                >
                  Registrations
                </NavLink>

                <NavLink
                  to="/volunteer-dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.activeLink}`
                      : styles.navbarLink
                  }
                >
                  Dashboard
                </NavLink>
              </>
            )}

            {profile?.role === "organizer" && (
              <>
                <NavLink
                  to="/organizer-dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.activeLink}`
                      : styles.navbarLink
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/organizer-dashboard/create-event"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navbarLink} ${styles.activeLink}`
                      : styles.navbarLink
                  }
                >
                  Create Event
                </NavLink>
              </>
            )}
          </div>

          <div className={styles.navbarRight}>
            {!user || !profile ? (
              <>
                <Link
                  to="/login"
                  className={`${styles.navbarAuthBtn} ${styles.desktopBtn}`}
                >
                  <FiUser className={styles.authIcon} />
                  Register/Login
                </Link>

                <Link
                  to="/login"
                  className={`${styles.iconBtn} ${styles.tabletOnly}`}
                  aria-label="Register/Login"
                >
                  <FiUser />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={profileLink}
                  className={`${styles.navbarProfileCircle} ${styles.desktopBtn}`}
                  aria-label="Profile"
                >
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Profile avatar"
                      className={styles.navbarProfileImage}
                    />
                  ) : (
                    getInitial()
                  )}
                </Link>

                <button
                  className={`${styles.navbarLogoutBtn} ${styles.desktopBtn}`}
                  onClick={handleLogout}
                  type="button"
                >
                  <FiLogOut className={styles.authIcon} />
                  Logout
                </button>

                <Link
                  to={profileLink}
                  className={`${styles.iconBtn} ${styles.tabletOnly}`}
                  aria-label="Profile"
                >
                  {getInitial()}
                </Link>
              </>
            )}

            <button
              className={styles.menuToggle}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`${styles.mobileMenuOverlay} ${menuOpen ? styles.open : ""}`}
        onClick={closeMenu}
      >
        <div
          className={`${styles.mobileMenuPanel} ${menuOpen ? styles.open : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.mobileMenuTop}>
            <Link
              to="/"
              className={styles.mobileLogoLink}
              onClick={closeMenu}
            >
              <img
                src={logo}
                alt="website logo"
                className={styles.mobileLogo}
              />
            </Link>

            <button
              className={styles.mobileCloseBtn}
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          <div className={styles.mobileMenuLinks}>
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={styles.mobileMenuLink}
            >
              Home
            </NavLink>

            <NavLink
              to="/events"
              onClick={closeMenu}
              className={styles.mobileMenuLink}
            >
              Events
            </NavLink>

            <NavLink
              to="/aboutus"
              onClick={closeMenu}
              className={styles.mobileMenuLink}
            >
              About Us
            </NavLink>

            {!user || !profile ? (
              <NavLink
                to="/login"
                onClick={closeMenu}
                className={styles.mobileMenuLink}
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
                      className={styles.mobileMenuLink}
                    >
                      Saved Events
                    </NavLink>

                    <NavLink
                      to="/user-registrations"
                      onClick={closeMenu}
                      className={styles.mobileMenuLink}
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
                      className={styles.mobileMenuLink}
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/organizer-dashboard/create-event"
                      onClick={closeMenu}
                      className={styles.mobileMenuLink}
                    >
                      Create Event
                    </NavLink>
                  </>
                )}

                <NavLink
                  to={profileLink}
                  onClick={closeMenu}
                  className={styles.mobileMenuLink}
                >
                  Profile
                </NavLink>

                <button
                  type="button"
                  className={`${styles.mobileMenuLink} ${styles.mobileLogoutBtn}`}
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