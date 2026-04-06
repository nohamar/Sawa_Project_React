import type { Event } from "../../types/events";
import styles from "../../css/EventCard.module.css";

type EventCardProps = {
  event: Event;
  currentUserId: number | null;
  currentUserRole?: "organizer" | "volunteer" | null;
  isRegistered?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: number) => void;
  onRegister?: (eventId: number, isRegistered: boolean) => void;
  onClick?: () => void;
};

export const EventCard = ({
  event,
  currentUserId,
  currentUserRole,
  isRegistered = false,
  onEdit,
  onDelete,
  onRegister,
  onClick,
}: EventCardProps) => {
  const isOwner =
    currentUserId !== null && Number(event.organizer_id) === currentUserId;

  return (
    <div className={styles.card} onClick={onClick}>
      {/* Event Info */}
      <div className={styles.info}>
        <h3 className={styles.title}>{event.title}</h3>

        <div className={styles.meta}>
          <span className={styles.metaRow}>
            <i className={styles.icon}>📅</i>
            {new Date(event.event_date).toLocaleDateString()}
          </span>

          <span className={styles.metaRow}>
            <i className={styles.icon}>📍</i>
            {event.location}
          </span>

          <span className={styles.metaRow}>
            <i className={styles.icon}>👥</i>
            Capacity:{" "}
            <strong>{event.capacity ?? "N/A"}</strong>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.divider} />
      <div className={styles.actions}>
        {isOwner && onEdit && (
          <button
            className={`${styles.btn} ${styles.btnEdit}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
          >
            Edit
          </button>
        )}

        {isOwner && onDelete && (
          <button
            className={`${styles.btn} ${styles.btnDelete}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event.id);
            }}
          >
            Delete
          </button>
        )}

        {!isOwner && currentUserRole === "volunteer" && onRegister && (
          <button
            className={`${styles.btn} ${
              isRegistered ? styles.btnRegistered : styles.btnRegister
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onRegister(event.id, isRegistered);
            }}
          >
            {isRegistered ? "✓ Registered" : "Register"}
          </button>
        )}
      </div>
    </div>
  );
};