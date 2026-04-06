import type { Event } from "../../types/events";
import styles from "../../css/EventDetails.module.css";
import { getEventStatus } from "../../utils/eventStatus";

type EventDetailsProps = {
  event: Event;
  currentUserId: number | null;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: number) => void;
  onRegister?: (eventId: number, isRegistered: boolean) => void;
  isRegistered?: boolean;
   
};

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  currentUserId,
  onEdit,
  onDelete,
  onRegister,
  isRegistered = false,
  
}) => {
  const isOwner = currentUserId === event.organizer_id;
  const isLoggedIn = !!currentUserId;

  const formattedDate = new Date(event.event_date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const status = getEventStatus(
  event.event_date,
  event.end_time,
  event.capacity
);
  
 
  return (
      <div className={styles.page}>
 
      
      <div className={styles.topRow}>
        <span className={styles.statusBadge}>
         <span className={styles.eyebrow}>Event Details</span>
        </span>
        
      </div>
 
      {/* Title */}
      <h1 className={styles.title}>{event.title}</h1>
 
      {/* Accent rule */}
      <hr className={styles.rule} />
 
      {/* Description */}
      {event.description && (
        <p className={styles.description}>{event.description}</p>
      )}
 
      {/* Meta block — newspaper column style */}
      <div className={styles.metaBlock}>
  <div className={styles.metaItem}>
    <span className={styles.metaLabel}>📅 Date</span>
    <span className={styles.metaValue}>{formattedDate}</span>
  </div>

  <div className={styles.metaItem}>
    <span className={styles.metaLabel}>🕐 Time</span>
    <span className={styles.metaValue}>
      {event.start_time} – {event.end_time}
    </span>
  </div>

  <div className={styles.metaItem}>
    <span className={styles.metaLabel}>📍 Location</span>
    <span className={styles.metaValue}>{event.location}</span>
  </div>

  {/* NEW: Duration */}
  {event.duration && (
    <div className={styles.metaItem}>
      <span className={styles.metaLabel}>⏱ Duration</span>
      <span className={styles.metaValue}>
        {event.duration} min
      </span>
    </div>
  )}

  {/* NEW: Type */}
  {event.type && (
    <div className={styles.metaItem}>
      <span className={styles.metaLabel}>🏷 Type</span>
      <span className={styles.metaValue}>
        {event.type}
      </span>
    </div>
  )}

        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Status</span>
          <span className={`${styles.status} ${styles[status]}`}>{status}</span>
        </div>
      </div>
 
      {/* Capacity bar */}
      {event.capacity && (
        <div className={styles.capacityRow}>
          <span className={styles.capacityLabel}>Capacity</span>
          <div className={styles.capacityBar}>
            <div className={styles.capacityFill} />
          </div>
          <span className={styles.capacityValue}>{event.capacity} spots</span>
        </div>
      )}
 
      {/* Owner actions */}
      {isOwner && (
        <div className={styles.actions}>
          {onEdit && (
            <button className={styles.btnEdit} onClick={() => onEdit(event)}>
              Edit Event
            </button>
          )}
          {onDelete && (
            <button className={styles.btnDelete} onClick={() => onDelete(event.id)}>
              Delete
            </button>
          )}
        </div>
      )}
 
      {/* Volunteer register */}
      {!isOwner && isLoggedIn && onRegister && (
        <div className={styles.actions}>
          <button
            className={isRegistered ? styles.btnRegistered : styles.btnRegister}
            onClick={() => onRegister(event.id, isRegistered)}
          >
            {isRegistered ? "✓ Registered" : "Register for this Event"}
          </button>
        </div>
      )}
 
      {/* Not logged in */}
      {!isOwner && !isLoggedIn && (
        <div className={styles.loginNotice}>
          <i className={styles.loginIcon}>🔒</i>
          Login required to register
        </div>
      )}
 
    </div>
  );
};