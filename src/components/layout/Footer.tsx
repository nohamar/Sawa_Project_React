import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";
import "../../Footer.css";
import logo from "../../assets/Sawa_logo.png";

function Footer() {
  return (
    <footer className="footer">
      {/* ── Hero Statement Strip ── */}
      <div className="footer-banner">
        <div className="footer-banner-inner">
          <h2 className="footer-headline">
            When Lebanon needs you most,
            <br />
            <em>show up.</em>
          </h2>
          <div className="footer-cta-group">
            <Link to="/events" className="footer-cta-btn">
              Volunteer Now
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-left">
          <Link to="/" className="footer-logo-link">
            <img src={logo} alt="Sawa logo" className="footer-logo" />
          </Link>
          <p className="footer-tagline">Together for Lebanon</p>
          <p className="footer-text">
            Bridging volunteers with frontline communities across Lebanon —
            because real change starts with one person choosing to act.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="#" className="social-icon" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Nav */}
        <div className="footer-column">
          <h3 className="footer-heading">Navigate</h3>
          <Link to="/" className="footer-link">
            Home
          </Link>
          <Link to="/events" className="footer-link">
            Events
          </Link>
          <Link to="/aboutus" className="footer-link">
            About Us
          </Link>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3 className="footer-heading">Reach Us</h3>

          <div className="footer-contact-item">
            <FaPhone className="footer-contact-icon" />
            <span>+961 81 912 496</span>
          </div>

          <div className="footer-contact-item">
            <FaMapMarkerAlt className="footer-contact-icon" />
            <span>Chamaa Road, Saida, Lebanon</span>
          </div>

          <div className="footer-contact-item">
            <FaEnvelope className="footer-contact-icon" />
            <span>sawa@info.com</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Sawa. All rights reserved.
          </p>
          <nav className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
