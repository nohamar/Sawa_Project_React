import { useNavigate } from "react-router-dom";
import styles from "../css/AboutPage.module.css";

import { FaHandsHelping, FaLightbulb, FaUsers } from "react-icons/fa";

export default function AboutUsPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.aboutPage}>

      <section
        className={styles.hero}
        style={{ backgroundImage: `url("/images/aboutus-hero.jpg")` }}
      >
        <div className={styles.herocontent}>
          <h1>Connecting People, Creating Memories</h1>
          <p>Creating moments that inspire and connections that last.</p>
          <button onClick={() => navigate("/events")}>Explore Events</button>
        </div>
      </section>

      
      <section className={styles.intro}>
        <h1>About Us</h1>
        <p>
          Our platform connects organizers and volunteers through meaningful events.
          Users can create events, explore opportunities, and participate in activities
          that make a real impact in the community.
        </p>
      </section>

      {/* Mission Section */}

<section className={styles.mission}>
  <h2>Our Mission</h2>

  <div className={styles.missionGrid}>
    <div className={styles.card}>
      <FaLightbulb className={styles.icon} />
      <h3>Simplicity</h3>
      <p>Create and manage events.</p>
    </div>

    <div className={styles.card}>
      <FaUsers className={styles.icon} />
      <h3>Community</h3>
      <p>Bring people together through events.</p>
    </div>

    <div className={styles.card}>
      <FaHandsHelping className={styles.icon} />
      <h3>Impact</h3>
      <p>Help volunteers make a difference.</p>
    </div>
  </div>
</section>
      {/* Team Section */}
      <section className={styles.team}>
        <h2>Our Team</h2>

        <div className={styles.teamContainer}>
          <div className={styles.memberCard}>
            <img src="/images/Bissan.jpeg" alt="Team member" />
            <h3>Bissan Al Miari</h3>

          </div>

          <div className={styles.memberCard}>
            <img src="/images/Rasha.jpeg" alt="Team member" />
            <h3>Rasha Abd AlLatif</h3>

          </div>

          <div className={styles.memberCard}>
            <img src="" alt="Team member" />
            <h3>Noha Mardini</h3>

          </div>
        </div>
      </section>

    </div>
  );
}