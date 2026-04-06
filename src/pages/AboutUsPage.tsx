import styles from "../css/AboutPage.module.css";

export default function AboutUsPage() {
  return (
    <div className={styles.aboutPage}>

      {/* Intro Section */}
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
        <p>
          Our mission is to make event organization simple and accessible while
          encouraging community engagement. We aim to empower organizers to share
          their ideas and help volunteers easily find and join events they care about.
        </p>
      </section>

      {/* Team Section */}
      <section className={styles.team}>
        <h2>Our Team</h2>

        <div className={styles.teamContainer}>
          <div className={styles.memberCard}>
            <img src="" alt="Team member" />
            <h3>Member Name</h3>
            
          </div>

          <div className={styles.memberCard}>
            <img src="" alt="Team member" />
            <h3>Member Name</h3>
            
          </div>

          <div className={styles.memberCard}>
            <img src="" alt="Team member" />
            <h3>Member Name</h3>
           
          </div>
        </div>
      </section>

    </div>
  );
}