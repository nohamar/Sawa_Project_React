import { useEvents } from "../hooks/useEvents";
import { useRegister } from "../hooks/useRegister";
import EventList from "../components/events/EventList";
import SearchBar from "../components/shared/SearchBar";
import FilterBar from "../components/shared/FilterBar";
import type { Profile } from "../types/profile";
import { useState } from "react";
import styles from "../css/EventList.module.css";
import type { Event } from "../types/events";
import type { CardAction } from "../components/events/EventCard";
import { useNavigate } from "react-router-dom";

type EventsPageProps = { profile: Profile | null };

export default function EventsPage({ profile }: EventsPageProps) {
  const { events, loading: eventsLoading, error: eventsError, removeEvent } = useEvents();
  const { registeredEventIds, loading: regLoading, toggleRegistration } =
    useRegister(profile?.id ?? null);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const eventTypes = ["Workshop", "Seminar", "Volunteer", "Social", "Charity"];

  if (eventsLoading || regLoading)
    return <p className={styles.noEvents}>Loading events...</p>;
  if (eventsError)
    return (
      <p className={styles.noEvents} style={{ color: "red" }}>
        {eventsError}
      </p>
    );


  const getActions = (event: Event): CardAction[] => {
    const isOwner = profile?.id === event.organizer_id;
    const isRegistered = registeredEventIds.includes(event.id);

    const actions: CardAction[] = [];



    const handleDelete = async (event: Event) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this event?");
      if (!confirmDelete) return;

      await removeEvent(event);
    };

    if (isOwner) {
      actions.push({
        label: "Edit",
        onClick: () => navigate(`/organizer-dashboard/edit-event/${event.id}`),
        className: `${styles.btn} ${styles.btnEdit}`,
      });

      actions.push({
        label: "Delete",
        onClick: () => handleDelete(event),
        className: `${styles.btn} ${styles.btnDelete}`,
      });
    } else if (profile?.role === "volunteer") {
      actions.push({
        label: isRegistered ? "Registered" : "Register",
        onClick: () => toggleRegistration(event.id, isRegistered),
        className: isRegistered
          ? `${styles.btn} ${styles.btnRegistered}`
          : `${styles.btn} ${styles.btnRegister}`,
      });
      actions.push({
        label: "Saved",
        onClick: () => console.log("saved", event.id),
        className: `${styles.btn} ${styles.btnSaved}`,
      });
    }

    return actions;
  };

  const filteredEvents = events.filter((event) => {
    const matchesStatus = !status || event.status === status;
    const matchesType = !type || event.type === type;
    const matchesKeyword =
      !keyword || event.title.toLowerCase().includes(keyword.toLowerCase());

    return matchesStatus && matchesType && matchesKeyword;
  });

  return (
    <div className={styles.eventsPage}>
      {/* Hero */}
      <div
        className={styles.hero}
        style={{ backgroundImage: `url("/images/events-hero.jpg")` }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Discover Our Events</h1>
          <p className={styles.heroSubtitle}>
            Join us in exciting activities and volunteer opportunities that make
            a difference.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.eventsContainer}>
        <div className="upper-part">
          <h2 className={styles.eventsHeading}>Explore Events</h2>
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
        </div>

        <EventList
          events={filteredEvents}
          getActions={getActions}
        />
      </div>
    </div>
  );
}