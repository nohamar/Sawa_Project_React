import { useEvents } from "../hooks/useEvents";
import EventList from "../components/events/EventList";
import type { Profile } from "../types/profile";
import styles from "../css/EventList.module.css";
import type { Event } from "../types/events";
import type { CardAction } from "../components/events/EventCard";

type Props = {
  profile: Profile | null;
};

export default function OrganizerEventsPage({ profile }: Props) {
  const { events, loading, error } = useEvents();

  if (loading) return <p className={styles.noEvents}>Loading...</p>;
  if (error) return <p className={styles.noEvents}>{error}</p>;

  const orgEvents = events.filter(
    (event) => event.organizer_id === profile?.id
  );

  const getActions = (event: Event): CardAction[] => [
    {
      label: "Edit",
      onClick: () => console.log("edit", event.id),
      className: `${styles.btn} ${styles.btnEdit}`,
    },
    {
      label: "Delete",
      onClick: () => console.log("delete", event.id),
      className: `${styles.btn} ${styles.btnDelete}`,
    },
  ];

  return (
    <div className={styles.eventsPage}>
      <h2 className={styles.eventsHeading}>My Events</h2>

      <EventList
        events={orgEvents}
        getActions={getActions}
      />
    </div>
  );
}