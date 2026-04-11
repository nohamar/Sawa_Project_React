import { useEvents } from "../hooks/useEvents";
import EventList from "../components/events/EventList";
import type { Profile } from "../types/profile";
import styles from "../css/EventList.module.css";

import type { Event } from "../types/events";
import type { CardAction } from "../components/events/EventCard";
import { useNavigate } from "react-router-dom";

type Props = {
  profile: Profile | null;
};

export default function OrganizerEventsPage({ profile }: Props) {
  const { events, loading, error, removeEvent } = useEvents();
  const navigate = useNavigate();

  const handleDelete = async (event: Event) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    await removeEvent(event);
  };

  if (loading) return <p className={styles.noEvents}>Loading...</p>;
  if (error) return <p className={styles.noEvents}>{error}</p>;

  const orgEvents = events.filter(
    (event) => event.organizer_id === profile?.id
  );

  const getActions = (event: Event): CardAction[] => [
    {
      label: "Edit",
      onClick: () => navigate(`/organizer-dashboard/edit-event/${event.id}`),
      className: `${styles.btn} ${styles.btnEdit}`,
    },
    {
      label: "Delete",
      onClick: () => handleDelete(event),
      className: `${styles.btn} ${styles.btnDelete}`,
    },
  ];

  return (
    <div className={styles.eventsPage}>
      <div className={styles.eventsContainer}>
        <h2 className={styles.eventsHeading}>My Events</h2>

        <EventList
          events={orgEvents}
          getActions={getActions}
        />
      </div>
    </div>
  );
}