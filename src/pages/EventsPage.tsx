import { useEvents } from "../hooks/useEvents";
import { useRegister } from "../hooks/useRegister.ts";
import EventList from "../components/events/EventList";
import type { Profile } from "../types/profile";
import heroImage from "../images/events-hero.jpg";
import styles from "../css/EventList.module.css";
import SearchBar from "../components/shared/SearchBar.tsx";
import FilterBar from "../components/shared/FilterBar.tsx";
import { useState } from "react";

type EventsPageProps = { profile: Profile | null };

export default function EventsPage({ profile }: EventsPageProps) {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { registeredEventIds, loading: regLoading, toggleRegistration } = useRegister(profile?.id ?? null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const eventTypes = ["Workshop", "Seminar", "Volunteer", "Social", "Charity"];
  if (eventsLoading || regLoading) return <p className={styles.noEvents}>Loading events...</p>;
  if (eventsError) return <p className={styles.noEvents} style={{ color: "red" }}>{eventsError}</p>;

  const filteredEvents = events.filter((event) => {
    const matchesStatus = !status || event.status === status;
    const matchesType = !type || event.type === type;
    const matchesKeyword =
      !keyword || event.title.toLowerCase().includes(keyword.toLowerCase());

    return matchesStatus && matchesType && matchesKeyword;
  });

  return (
    <div className={styles.eventsPage}>
      {/* Hero Section */}
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Discover Our Events</h1>
          <p className={styles.heroSubtitle}>Join us in exciting activities and volunteer opportunities that make a difference.</p>
        </div>
      </div>


      {/* Events Section */}
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
        {filteredEvents.length === 0 ? (
          <p className={styles.noEvents}>No events match your search.</p>
        ) : (
          <EventList
            events={events}
            currentUserId={profile?.id ?? null}
            currentUserRole={profile?.role ?? null}
            registeredEventIds={registeredEventIds}
            onRegister={toggleRegistration}
          />
        )}
      </div>
    </div >
  );
}