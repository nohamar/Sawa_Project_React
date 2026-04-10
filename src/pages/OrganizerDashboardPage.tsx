import { useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";

import { getImageUrl } from "../services/storageService";
import styles from "../css/OrganizerDashboard.module.css";
import { useRegister } from "../hooks/useRegister";

type Props = {
  currentUserId: number;
};

export default function OrganizerDashboard({ currentUserId }: Props) {
  const { events, loading } = useEvents();
  const {allRegistrations} = useRegister(null);
  const navigate = useNavigate();

  // 🔹 Organizer Events
  const organizerEvents = events.filter(
    (e) => e.organizer_id === currentUserId
  );

  // 🔹 Stats
  const upcomingEvents = organizerEvents.filter(
    (e) => new Date(e.event_date) > new Date()
  );

  const completedEvents = organizerEvents.filter(
    (e) => new Date(e.event_date) < new Date()
  );

  // 🔹 Confirmed Registrations (REAL FIX)
  const organizerEventIds = organizerEvents.map((e) => String(e.id));

const confirmedRegistrations = allRegistrations.filter(
  (r) =>
    r.registration_status === "confirmed" &&
    organizerEventIds.includes(r.event_id)
).length;

  // 🔹 Recent Upcoming
  const recentUpcoming = upcomingEvents.slice(0, 3);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className={styles.dashboard}>
      
      {/* 🔹 TITLE */}
      <h2 className={styles.title}>Organizer Dashboard</h2>

      {/* 🔹 STATS */}
      <div className={styles.stats}>
        <div className={styles.card}>
          <h3>{organizerEvents.length}</h3>
          <p>Total Events</p>
        </div>

        <div className={styles.card}>
          <h3>{confirmedRegistrations}</h3>
          <p>Confirmed Registrations</p>
        </div>

        <div className={styles.card}>
          <h3>{completedEvents.length}</h3>
          <p>Completed Events</p>
        </div>

        <div className={styles.card}>
          <h3>{upcomingEvents.length}</h3>
          <p>Upcoming Events</p>
        </div>
      </div>

      {/* 🔹 GRAPH SECTION */}
      <div className={styles.graphSection}>
        <h3>Event Analytics</h3>
        <p>Graphs coming soon...</p>
      </div>

      {/* 🔹 RECENT EVENTS */}
      <div className={styles.recentSection}>
        <div className={styles.recentHeader}>
          <h3>Upcoming Events</h3>
          <button onClick={() => navigate("/organizer-events")}>
            Browse All
          </button>
        </div>

        {recentUpcoming.length === 0 ? (
          <p>No upcoming events</p>
        ) : (
          recentUpcoming.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              
            
              <img
                src={
                  event.image
                    ? (() => {
                        const imageUrl = getImageUrl(event.image);
                        return typeof imageUrl === "string"
                          ? imageUrl
                          : imageUrl?.data?.publicUrl || "/default-event.jpg";
                      })()
                    : "/default-event.jpg"
                }
                alt={event.title}
                className={styles.eventImage}
              />

             
              <div className={styles.eventInfo}>
                <h4>{event.title}</h4>
                <p>{new Date(event.event_date).toLocaleDateString()}</p>
              </div>

            </div>
          ))
        )}
      </div>

      {/* 🔹 ADD EVENT SECTION */}
      <div className={styles.addSection}>
        <h3>Create a New Event</h3>
        <p>
          Ready to organize something amazing? Add a new event and start attracting participants.
        </p>

        <button onClick={() => navigate("/create-event")}>
          + Add Event
        </button>
      </div>

    </div>
  );
}