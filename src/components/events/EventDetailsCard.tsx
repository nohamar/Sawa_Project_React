
import styles from "../../css/EventDetails.module.css";
import type { Event } from "../../types/events";
import type { Registration } from "../../types/registration";
import { getImageUrl } from "../../services/storageService";
import { useState } from "react";


export type CardAction = {
  label: string;
  onClick: () => void;
  className?: string;
};
type EventDetailsProps = {
  event: Event;
  registrations: Registration[];
  status: string;
  actions?: CardAction[];
  registeredCount: number;
};

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  registrations,
  status,
  actions = [],
  registeredCount,
}) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const formattedDate = new Date(event.event_date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <span className={styles.topLabel}>{event.type ?? "Volunteer event"}</span>
        {status && (
          <span className={`${styles.statusPill} ${styles[event.status]}`}>
            {event.status}
          </span>
        )}
      </div>

      <div className={styles.layout}>
        {/* Left column */}
        <div className={styles.left}>
          <div className={styles.imageWrapper}>
            {event.image && !failedImages.has(String(event.id)) ? (
              <img 
                src={getImageUrl(event.image)} 
                alt={event.title} 
                className={styles.image}
                onError={() => {
                  setFailedImages((prev) => new Set(prev).add(String(event.id)));
                }}
              />
            ) : (
              <img 
                src="/images/event_hero.jpg" 
                alt={event.title} 
                className={styles.image}
              />
            )}
            {event.type && <span className={styles.heroTag}>{event.type}</span>}
          </div>

          <h1 className={styles.title}>{event.title}</h1>
          {event.description && <p className={styles.desc}>{event.description}</p>}

          {/* Info rows */}
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
                  stroke="var(--accent-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <div>
                <div className={styles.infoLabel}>Date</div>
                <div className={styles.infoVal}>{formattedDate}</div>
              </div>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
                  stroke="var(--accent-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <div>
                <div className={styles.infoLabel}>Time</div>
                <div className={styles.infoVal}>
                  {event.start_time} – {event.end_time}
                  {event.duration && <> &nbsp;·&nbsp; {event.duration} min</>}
                </div>
              </div>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
                  stroke="var(--accent-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-8-7.5-8-13a8 8 0 0116 0c0 5.5-8 13-8 13z" />
                  <circle cx="12" cy="8" r="2.5" />
                </svg>
              </div>
              <div>
                <div className={styles.infoLabel}>Location</div>
                <div className={styles.infoVal}>{event.location}</div>
              </div>
            </div>
          </div>
        </div>
       
        {/* Right column */}
        <div className={styles.right}>
          {/* Capacity bar */}
          {event.capacity && (
            <div className={styles.card}>
              <div className={styles.cardTitle}>Capacity</div>
              <div className={styles.capTrack}>
                <div
                  className={styles.capFill}
                  style={{ width: `${(registeredCount / (event.capacity || 1)) * 100}%` }}
                />
              </div>
              <div className={styles.capRow}>
                <span>{event.capacity} spots total</span>
                <span className={styles.capAccent}>Filling up</span>
              </div>
            </div>
          )}
<div className={styles.actions}>
 {actions.map((action, i) => (
          <button key={i} onClick={action.onClick} className={ styles.actionBtn}>
            {action.label}
          </button>
        ))}
        </div>
        </div>
      </div>
    </div>
  );
};