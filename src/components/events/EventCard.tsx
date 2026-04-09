import type { Event } from "../../types/events"; 
import styles from "../../css/EventCard.module.css"; 

export type CardAction = { 
  label: string; 
  onClick: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void); 
  className?: string; 
}; 
  
  type EventCardProps = { 
  event: Event;
  
  actions?: CardAction[];
  onClick?: () => void;
  };

export const EventCard = ({
  event,

  actions = [],
  onClick,
}: EventCardProps) => {


  return (
    <div className={styles.card} onClick={onClick}>
      {/* Image */}
      <div className={styles.imageWrapper}>
        <img src={event.image} alt={event.title} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Top row */}
        <div className={styles.topRow}>
          <h3 className={styles.title}>{event.title}</h3>
          <span className={`${styles.statusBadge} ${styles[event.status]}`}> {event.status} </span>
        </div>

        <span> {event.description}</span>
        {/* Meta (NO icons) */}
        <div className={styles.meta}>
          <span>{new Date(event.event_date).toLocaleDateString()}</span>
          <span>{event.location}</span>

        </div>

           <div className={styles.bottomRow}>
          <div className={styles.actions}>
            {actions.map((action, i) => (
              <button
                key={i}
                className={action.className || styles.btn}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(e);
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};