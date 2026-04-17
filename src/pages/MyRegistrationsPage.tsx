import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Event } from "../types/events";
import type { CardAction } from "../components/events/EventCard";

import { useRegister } from "../hooks/useRegister";
import { useSaved } from "../hooks/useSaved";

import EventList from "../components/events/EventList";
import ConfirmationDialog from "../components/shared/ConfirmationDialog";
import SearchBar from "../components/shared/SearchBar";
import FilterBar from "../components/shared/FilterBar";
import Loader from "../components/shared/Loader";
import styles from "../css/EventList.module.css";

type MyRegistrationsPageProps = {
  id: number | null;
};

export default function MyRegistrationsPage({ id }: MyRegistrationsPageProps) {
  const navigate = useNavigate();

  const {
    registeredEvents,
    loading: registerLoading,
    error: registerError,
    toggleRegistration,
  } = useRegister(id);

  const {
    saved,
    loading: savedLoading,
    error: savedError,
    successMessage,
    addSaved,
    removeSaved,
  } = useSaved(id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingUnregisterEventId, setPendingUnregisterEventId] = useState<number | null>(null);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const eventTypes = ["Workshop", "Seminar", "Volunteer", "Social", "Charity"];

  const pageLoading = registerLoading || savedLoading;
  const pageError = registerError || savedError;

  const savedEventIds = saved.map((event) => event.id);

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

  async function handleSaveToggle(eventId: number) {
    const isSaved = savedEventIds.includes(eventId);

    if (isSaved) {
      await removeSaved(eventId);
    } else {
      await addSaved(eventId);
    }
  }

  const getActions = (event: Event): CardAction[] => {
    const isSaved = savedEventIds.includes(event.id);

    return [
      {
        label: "View Details",
        onClick: () => navigate(`/events/${event.id}`),
        className: `${styles.btn}`,
      },
      {
        label: "Unregister",
        onClick: () => handleAskUnregister(event.id),
        className: `${styles.btn} ${styles.btnDelete}`,
      },
      {
        label: isSaved ? "Unsave" : "Save",
        onClick: () => handleSaveToggle(event.id),
        className: `${styles.btn} ${styles.btnEdit}`,
      },
    ];
  };

  const filteredRegisteredEvents = registeredEvents.filter((event) => {
    const matchesStatus = !status || event.status === status;
    const matchesType = !type || event.type === type;
    const matchesKeyword =
      !keyword ||
      event.title.toLowerCase().includes(keyword.toLowerCase()) ||
      event.location.toLowerCase().includes(keyword.toLowerCase());

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
      <h2 className={styles.eventsHeading}>My Registrations</h2>

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

      <EventList events={filteredRegisteredEvents} getActions={getActions} />

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