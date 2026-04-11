import { useEvents } from "../hooks/useEvents";
import styles from "../css/HomePage.module.css";
import { useNavigate } from "react-router-dom";

import { useMemo, useState } from "react";
import { FaCalendarCheck, FaPlusCircle, FaSearch } from "react-icons/fa";


export default function HomePage() {
  const { events, loading, error } = useEvents();
  const navigate = useNavigate();

   const today = useMemo(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }, []);
 const upcomingEvents = events.filter((e) => {
    const d = new Date(e.event_date);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  });



  return (
    <div className={styles.homePage}>

     
      <section
        className={styles.hero}
        style={{ backgroundImage: `url("/images/home-hero1.jpg")` }}
      >
        <div className={styles.herocontent}>
        <h1>Welcome to Our Events Portal</h1>
        <p>Discover events and make a difference!</p>
        <button onClick={() => navigate("/events")}>Explore Events</button>
        </div>
      </section>


<section className={styles.intro}>
  <h2>What You Can Do</h2>

  <p>
    Create your own events or register for existing ones to participate.
  </p>

  <div className={styles.userdo}>
    <div className={styles.card}>
      <FaSearch className={styles.icon} />
      <p>Browse events and discover what’s happening around you.</p>
    </div>

    <div className={styles.card}>
      <FaPlusCircle className={styles.icon} />
      <p>Create your own event and share it with others.</p>
    </div>

    <div className={styles.card}>
      <FaCalendarCheck className={styles.icon} />
      <p>Join events and be part of exciting experiences.</p>
    </div>
  </div>
</section>

      
      <section className={styles.featuredEvents}>
        <h2>Upcoming Events</h2>

        {loading && <p>Loading events...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className={styles.eventList}>
          {upcomingEvents.slice(0, 3).map((event) => (
            <div key={event.id} className={styles.eventCard}>
              
              <div className={styles.eventContent}>
                <img 
                  src={event.image || ""}
                  alt={event.title}
                 
                />
                <h3>{event.title}</h3>
                <p className={styles.eventDate}>{event.event_date}</p>
                <p> {event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

     
      <section className={styles.cta}>
        <h2>Join an Event Today!</h2>
        <p>Be part of something amazing. Sign up and participate in upcoming events.</p>
        <button onClick={() => navigate("/events")}>Explore Events</button>
      </section>

    </div>
  );
}