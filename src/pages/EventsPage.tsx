import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEvents } from "../hooks/useEvents";
import { useRegister } from "../hooks/useRegister";
import { useSaved } from "../hooks/useSaved";

import EventList from "../components/events/EventList";
import SearchBar from "../components/shared/SearchBar";
import FilterBar from "../components/shared/FilterBar";
import ConfirmationDialog from "../components/shared/ConfirmationDialog";
import Loader from "../components/shared/Loader";
import type { Profile } from "../types/profile";
import type { Event } from "../types/events";
import type { CardAction } from "../components/events/EventCard";

import styles from "../css/EventList.module.css";

type EventsPageProps = { profile: Profile | null };

export default function EventsPage({ profile }: EventsPageProps) {
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    removeEvent,
    loadEvents,
  } = useEvents();

  const {
    registeredEventIds,
    registrationStatusByEvent,
    toggleRegistration,
    loading: regLoading,
    error: regError,
  } = useRegister(profile?.id ?? null);

  const {
    saved,
    addSaved,
    removeSaved,
    loading: savedLoading,
    error: savedError,
  } = useSaved(profile?.id ?? null);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingUnregisterEvent, setPendingUnregisterEvent] = useState<Event | null>(null);

  const [infoDialog, setInfoDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const eventTypes = ["Workshop", "Seminar", "Volunteer", "Social", "Charity"];

  const pageLoading = eventsLoading || regLoading || savedLoading;
  const pageError = eventsError || regError || savedError;

  const savedEventIds = useMemo(() => saved.map((event) => event.id), [saved]);

  function isCompletedEvent(event: Event) {
    return event.status.toLowerCase() === "completed";
  }

  async function handleDelete(event: Event) {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    await removeEvent(event);
  }

  async function handleToggleSave(event: Event) {
    if (isCompletedEvent(event)) {
      setInfoDialog({
        isOpen: true,
        title: "Event Completed",
        message:
          "This event has already been completed. Please check other available events to participate in.",
      });
      return;
    }

    const isSaved = savedEventIds.includes(event.id);

    if (isSaved) {
      await removeSaved(event.id);
    } else {
      await addSaved(event.id);
    }
  }

  async function handleRegister(event: Event) {
    if (isCompletedEvent(event)) {
      setInfoDialog({
        isOpen: true,
        title: "Event Completed",
        message:
          "This event has already been completed. Please check other available events to participate in.",
      });
      return;
    }

    const result = await toggleRegistration(event.id, false, event.capacity);

    if (!result.ok) return;

    setInfoDialog({
      isOpen: true,
      title: result.status === "waitlisted" ? "Added to Waiting List" : "Registration Successful",
      message: result.message,
    });
  }

  function handleAskUnregister(event: Event) {
    setPendingUnregisterEvent(event);
    setIsDialogOpen(true);
  }

  async function handleConfirmUnregister() {
    if (!pendingUnregisterEvent) return;

    const result = await toggleRegistration(
      pendingUnregisterEvent.id,
      true,
      pendingUnregisterEvent.capacity
    );

    setIsDialogOpen(false);
    setPendingUnregisterEvent(null);

    if (!result.ok) return;

    setInfoDialog({
      isOpen: true,
      title: "Unregistered",
      message: result.message,
    });
  }

  function handleCancelUnregister() {
    setIsDialogOpen(false);
    setPendingUnregisterEvent(null);
  }

  const getActions = (event: Event): CardAction[] => {
    const isOwner = profile?.id === event.organizer_id;
    const isRegistered = registeredEventIds.includes(event.id);
    const isSaved = savedEventIds.includes(event.id);
    const registrationStatus = registrationStatusByEvent[event.id];

    const actions: CardAction[] = [];

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
        label: isRegistered
          ? registrationStatus === "waitlisted"
            ? "Waitlisted"
            : "Unregister"
          : "Register",
        onClick: () =>
          isRegistered ? handleAskUnregister(event) : handleRegister(event),
        className: isRegistered
          ? `${styles.btn} ${styles.btnRegistered}`
          : `${styles.btn} ${styles.btnRegister}`,
      });

      actions.push({
        label: isSaved ? "Unsave" : "Save",
        onClick: () => handleToggleSave(event),
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

  if (pageLoading) {
    return <Loader />;
  }

  if (pageError) {
    return (
      <p className={styles.noEvents} style={{ color: "red" }}>
        {pageError}
      </p>
    );
  }

  return (
    <div className={styles.eventsPage}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGlowLeft}></div>
          <div className={styles.heroGlowRight}></div>
          <div className={styles.heroBlurCenter}></div>
        </div>

        <div className={styles.heroShell}>
          <div className={styles.heroLeft}>
            <div className={styles.heroTag}>
              <span className={styles.heroTagDot}></span>
              DISCOVER · JOIN · MAKE IMPACT
            </div>

            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Find events that
                <span className={styles.heroAccentWrap}>
                  <span className={styles.heroAccentText}> bring people together</span>
                  <svg
                    className={styles.heroUnderline}
                    viewBox="0 0 520 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 26C89 11 157 8 255 15C347 22 414 24 514 11"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className={styles.heroSubtitle}>
                Explore volunteer opportunities, community activities, and meaningful
                gatherings designed to create real impact across Lebanon.
              </p>

              <button
                className={styles.heroButton}
                onClick={() =>
                  document
                    .getElementById("eventsContainer")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Events
              </button>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroImageLayerBack}></div>

            <div className={styles.heroImageWrap}>
              <img
                src="/images/events-hero.jpg"
                alt="People joining a community event"
                className={styles.heroImg}
              />
            </div>

            <div className={styles.heroBadge}>
              <span>events with purpose ✿</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.eventsContainer} id="eventsContainer">
        <div className={styles.upperPart}>
          <h2 className={styles.eventsHeading}>Explore Events</h2>

          {infoMessage && (
            <p style={{ marginBottom: "12px", color: "#2d6a4f", fontWeight: 600 }}>
              {infoMessage}
            </p>
          )}

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

        <EventList events={filteredEvents} getActions={getActions} />
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Unregister from Event"
        message="Are you sure you want to unregister from this event?"
        confirmText="Yes, unregister"
        cancelText="Cancel"
        onConfirm={handleConfirmUnregister}
        onCancel={handleCancelUnregister}
      />

      <ConfirmationDialog
        isOpen={infoDialog.isOpen}
        title={infoDialog.title}
        message={infoDialog.message}
        confirmText="OK"
        showCancelButton={false}
        onConfirm={() =>
          setInfoDialog({ isOpen: false, title: "", message: "" })
        }
      />
    </div>
  );
}