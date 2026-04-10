import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../MainLayout.css";

function MainLayout() {
  const location = useLocation();
  const hideLayoutChrome = location.pathname === "/profile";

  return (
    <div className="layout-container">
      {!hideLayoutChrome && <Navbar />}

      <main className={`layout-content ${hideLayoutChrome ? "layout-content-profile" : ""}`}>
        <Outlet />
      </main>

      {!hideLayoutChrome && <Footer />}
    </div>
  );
}

export default MainLayout;