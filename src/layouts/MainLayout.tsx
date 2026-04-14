import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import styles from "../css/MainLayout.module.css";

function MainLayout() {
  const location = useLocation();
  const hideLayoutChrome = location.pathname === "/profile";

  return (
    <div className={styles["layout-container"]}>
      {!hideLayoutChrome && <Navbar />}

      <main
        className={`${styles["layout-content"]} ${
          hideLayoutChrome ? styles["layout-content-profile"] : ""
        }`}
      >
        <Outlet />
      </main>

      {!hideLayoutChrome && <Footer />}
    </div>
  );
}

export default MainLayout;