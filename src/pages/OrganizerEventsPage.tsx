import { useEvents } from "../hooks/useEvents";
import EventList from "../components/events/EventList";
import type { Profile } from "../types/profile";
import styles from "../css/EventList.module.css";
import type { Event } from "../types/events";
import type { CardAction } from "../components/events/EventCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "../components/shared/SearchBar";
import FilterBar from "../components/shared/FilterBar";

type Props = {
  profile: Profile | null;
};

export default function OrganizerEventsPage({ profile }: Props) {
  const {
    events,
    loading,
    error,
    removeEvent,
    loadEventsByOrganizer,
  } = useEvents();

   const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!profile?.id) return;
    loadEventsByOrganizer(profile.id);
  }, [profile?.id]);

  const handleDelete = async (event: Event) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    await removeEvent(event);
  };

  const getActions = (event: Event): CardAction[] => [
    {
      label: "Edit",
      onClick: () =>
        navigate(`/organizer-dashboard/edit-event/${event.id}`),
      className: `${styles.btn} ${styles.btnEdit}`,
    },
    {
      label: "Delete",
      onClick: () => handleDelete(event),
      className: `${styles.btn} ${styles.btnDelete}`,
    },
  ];
   const filteredEvents = events.filter((event) => {
    const matchesStatus = !status || event.status === status;
    const matchesType = !type || event.type === type;
    const matchesKeyword =
      !keyword || event.title.toLowerCase().includes(keyword.toLowerCase());

    return matchesStatus && matchesType && matchesKeyword;
  });

   const eventTypes = ["Workshop", "Seminar", "Volunteer", "Social", "Charity"];

  if (loading) return <p className={styles.noEvents}>Loading...</p>;
  if (error) return <p className={styles.noEvents}>{error}</p>;

  return (
    <div className={styles.eventsPage}>
      <div className={styles.eventsContainer}>
        <h2 className={styles.eventsHeading}>My Events</h2>
<div className={styles.filter}>
            <SearchBar keyword={keyword} onKeywordChange={setKeyword} />
            <FilterBar
              status={status}
              type={type}
              onStatusChange={setStatus}
              onTypeChange={setType}
              eventTypes={eventTypes}
            />
          </div>
        <EventList events={filteredEvents} getActions={getActions} />
      </div>
    </div>
  );
}