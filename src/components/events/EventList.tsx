import type { Event } from "../../types/events";
import { useNavigate } from "react-router-dom";
import { EventCard } from "./EventCard";
import styles from "../../css/EventList.module.css";

type EventListProps = {
  events: Event[];
  currentUserId: number | null;
  currentUserRole: "organizer" | "volunteer" | null;
  registeredEventIds: number[];
  onRegister: (eventId: number, isRegistered: boolean) => void;
};

export default function EventList({
  events,
  currentUserId,
  currentUserRole,
  registeredEventIds,
  onRegister,
}: EventListProps) {
  const navigate = useNavigate();

  
  if (!events) return <p className={styles.empty}>Loading events…</p>;
  if (!events.length) return <p className={styles.empty}>No events found.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {events.map((event: Event) => {
          const isRegistered = registeredEventIds.includes(Number(event.id));

          return (
            <EventCard
              key={event.id}
              event={{
                ...event,
                id: Number(event.id),
                organizer_id: Number(event.organizer_id),
              }}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              isRegistered={isRegistered}
              onRegister={onRegister}
              onClick={() => navigate(`/events/${event.id}`)}
            />
          );
        })}
      </div>
    </div>
  );
}