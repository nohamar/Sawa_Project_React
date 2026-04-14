import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";
import styles from "../../css/Footer.module.css";
import logo from "../../assets/Sawa_logo.png";

function Footer() {
  return (
    <footer className={styles.footer}>
      {/* ── Hero Statement Strip ── */}
      <div className={styles.footerBanner}>
        <div className={styles.footerBannerInner}>
          <h2 className={styles.footerHeadline}>
            When Lebanon needs you most,
            <br />
            <em>show up.</em>
          </h2>
          <div className={styles.footerCtaGroup}>
            <Link to="/events" className={styles.footerCtaBtn}>
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
      <div className={styles.footerContainer}>
        {/* Brand */}
        <div className={styles.footerLeft}>
          <Link to="/" className={styles.footerLogoLink}>
            <img src={logo} alt="Sawa logo" className={styles.footerLogo} />
          </Link>
          <p className={styles.footerTagline}>Together for Lebanon</p>
          <p className={styles.footerText}>
            Bridging volunteers with frontline communities across Lebanon —
            because real change starts with one person choosing to act.
          </p>
          <div className={styles.footerSocials}>
            <a href="#" className={styles.socialIcon} aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="#" className={styles.socialIcon} aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Nav */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Navigate</h3>
          <Link to="/" className={styles.footerLink}>
            Home
          </Link>
          <Link to="/events" className={styles.footerLink}>
            Events
          </Link>
          <Link to="/aboutus" className={styles.footerLink}>
            About Us
          </Link>
        </div>

        {/* Contact */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Reach Us</h3>

          <div className={styles.footerContactItem}>
            <FaPhone className={styles.footerContactIcon} />
            <span>+961 81 912 496</span>
          </div>

          <div className={styles.footerContactItem}>
            <FaMapMarkerAlt className={styles.footerContactIcon} />
            <span>Chamaa Road, Saida, Lebanon</span>
          </div>

          <div className={styles.footerContactItem}>
            <FaEnvelope className={styles.footerContactIcon} />
            <span>sawa@info.com</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomInner}>
          <p className={styles.footerCopyright}>
            © {new Date().getFullYear()} Sawa. All rights reserved.
          </p>
          <nav className={styles.footerLegal}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;