import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../MainLayout.css"
export default function MainLayout() {
  return (
    <div className="layout-container">
      <Navbar />

      <main className="layout-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}