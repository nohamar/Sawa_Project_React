import { useEvents } from "../hooks/useEvents";
import styles from "../css/HomePage.module.css";
import heroImage from "../images/home-hero1.jpg"
import { useNavigate } from "react-router-dom";


export default function HomePage() {
  const { events, loading, error } = useEvents();
const navigate = useNavigate();



  return (
    <div className={styles.homePage}>

      {/* Hero Section */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className={styles.herocontent}>
        <h1>Welcome to Our Events Portal</h1>
        <p>Discover events and make a difference!</p>
        <button onClick={() => navigate("/events")}>Explore Events</button>
        </div>
      </section>

      {/* Intro Section */}
      <section className={styles.intro}>
        <h2>What You Can Do</h2>
        <p>
         create your own events or register for existing events to participate. 
          
        </p>
        <div className={styles.userdo}>
          <div className={styles.card}>Browse events or add your own to get started!</div>
          <div className={styles.card}>Check out upcoming events and join the fun!</div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className={styles.featuredEvents}>
        <h2>Upcoming Events</h2>

        {loading && <p>Loading events...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className={styles.eventList}>
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className={styles.eventCard}>
              
              <div className={styles.eventContent}>
                <h3>{event.title}</h3>
                <p className={styles.eventDate}>{event.event_date}</p>
                <p> {event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Section */}
      <section className={styles.cta}>
        <h2>Join an Event Today!</h2>
        <p>Be part of something amazing. Sign up and participate in upcoming events.</p>
        <button onClick={() => navigate("/events")}>Explore Events</button>
      </section>

    </div>
  );
}