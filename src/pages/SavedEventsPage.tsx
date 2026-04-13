import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Event } from "../types/events";
import type { CardAction } from "../components/events/EventCard";

import { useSaved } from "../hooks/useSaved";
import { useRegister } from "../hooks/useRegister";

import EventList from "../components/events/EventList";
import ConfirmationDialog from "../components/shared/ConfirmationDialog";
import SearchBar from "../components/shared/SearchBar";
import FilterBar from "../components/shared/FilterBar";

import styles from "../css/EventList.module.css";

type SavedEventProps = {
  id: number; // better if this is the auth user id / profile.user_id
};

export default function SavedEventsPage({ id }: SavedEventProps) {
  const navigate = useNavigate();

  const {
    saved,
    loading: savedLoading,
    error: savedError,
    successMessage,
    removeSaved,
  } = useSaved(id);

  const {
    registeredEventIds,
    toggleRegistration,
    loading: registerLoading,
    error: registerError,
  } = useRegister(id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingUnregisterEventId, setPendingUnregisterEventId] = useState<number | null>(null);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const eventTypes = ["Workshop", "Seminar", "Volunteer", "Social", "Charity"];

  const pageLoading = savedLoading || registerLoading;
  const pageError = savedError || registerError;

  async function handleUnsave(eventId: number) {
    await removeSaved(eventId);
  }

  async function handleRegister(eventId: number) {
    await toggleRegistration(eventId, false);
  }

  function handleAskUnregister(eventId: number) {
    setPendingUnregisterEventId(eventId);
    setIsDialogOpen(true);
  }

  async function handleConfirmUnregister() {
    if (pendingUnregisterEventId === null) return;

    await toggleRegistration(pendingUnregisterEventId, true);
    setIsDialogOpen(false);
    setPendingUnregisterEventId(null);
  }

  function handleCancelUnregister() {
    setIsDialogOpen(false);
    setPendingUnregisterEventId(null);
  }

  const getActions = (event: Event): CardAction[] => {
    const isRegistered = registeredEventIds.includes(event.id);

    return [
      {
        label: "View Details",
        onClick: () => navigate(`/events/${event.id}`),
        className: `${styles.btn}`,
      },
      {
        label: "Unsave",
        onClick: () => handleUnsave(event.id),
        className: `${styles.btn} ${styles.btnDelete}`,
      },
      {
        label: isRegistered ? "Unregister" : "Register",
        onClick: () =>
          isRegistered
            ? handleAskUnregister(event.id)
            : handleRegister(event.id),
        className: `${styles.btn} ${styles.btnEdit}`,
      },
    ];
  };

  const filteredSavedEvents = saved.filter((event) => {
    const matchesStatus = !status || event.status === status;
    const matchesType = !type || event.type === type;
    const matchesKeyword =
      !keyword ||
      event.title.toLowerCase().includes(keyword.toLowerCase()) ||
      event.location.toLowerCase().includes(keyword.toLowerCase());

    return matchesStatus && matchesType && matchesKeyword;
  });

  if (pageLoading) return <p className={styles.noEvents}>Loading saved events...</p>;
  if (pageError) {
    return (
      <p className={styles.noEvents} style={{ color: "red" }}>
        {pageError}
      </p>
    );
  }

  return (
    <div className={styles.eventsPage}>
      <h2 className={styles.eventsHeading}>My Saved Events</h2>

      {successMessage && <p>{successMessage}</p>}

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

      <EventList events={filteredSavedEvents} getActions={getActions} />

      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Unregister from Event"
        message="Are you sure you want to unregister from this event?"
        confirmText="Yes, unregister"
        cancelText="Cancel"
        onConfirm={handleConfirmUnregister}
        onCancel={handleCancelUnregister}
      />
    </div>
  );
}