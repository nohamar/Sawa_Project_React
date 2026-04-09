import type { Event } from "../../types/events";
import { useNavigate } from "react-router-dom";
import { EventCard } from "./EventCard";
import styles from "../../css/EventList.module.css";
import type { CardAction } from "./EventCard";

type EventListProps = {
  events: Event[];
  getActions: (event: Event) => CardAction[];
};

export default function EventList({ events, getActions }: EventListProps) {
  const navigate = useNavigate();

  if (!events?.length)
    return <p className={styles.empty}>No events found.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            actions={getActions(event)} 
            onClick={() => navigate(`/events/${event.id}`)}
          />
        ))}
      </div>
    </div>
  );
}