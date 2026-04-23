import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/VolunteerDashboard.module.css";

import type { Event } from "../types/events";
import type { RegistrationWithEvent } from "../types/registration";
import type { FeedbackWithEvent } from "../types/feedback";
import type { SavedEventWithEvent } from "../types/saved";

import { getRegistration_User } from "../services/registration";
import {
  getFeedbackUser,
  deleteFeedbackById,
} from "../services/feedbackService";
import { getSavedEvents } from "../services/savedEventService";

import { useRegister } from "../hooks/useRegister";
import { useSaved } from "../hooks/useSaved";

import Loader from "../components/shared/Loader";
import ConfirmationDialog from "../components/shared/ConfirmationDialog";

type Props = {
  currentUserId?: number | null;
};

type PendingUnregisterState = {
  eventId: number;
  capacity?: number;
} | null;

export default function VolunteerDashboard({ currentUserId }: Props) {
  const navigate = useNavigate();

  const { toggleRegistration } = useRegister(currentUserId ?? null);
  const { addSaved, removeSaved } = useSaved(currentUserId ?? null);

  const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackWithEvent[]>([]);
  const [savedRows, setSavedRows] = useState<SavedEventWithEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [pendingUnregister, setPendingUnregister] =
    useState<PendingUnregisterState>(null);

  const [pendingDeleteFeedbackId, setPendingDeleteFeedbackId] = useState<
    number | null
  >(null);

  const [infoDialog, setInfoDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  function getEventFromField(eventField: Event | Event[] | null): Event | null {
    if (!eventField) return null;
    if (Array.isArray(eventField)) return eventField[0] ?? null;
    return eventField;
  }

  function goToEventDetails(eventId: number) {
    navigate(`/events/${eventId}`);
  }

  async function loadDashboardData() {
    if (!currentUserId) {
      setRegistrations([]);
      setFeedbacks([]);
      setSavedRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setPageError("");

    const [registrationsRes, feedbacksRes, savedRes] = await Promise.all([
      getRegistration_User(String(currentUserId)),
      getFeedbackUser(currentUserId),
      getSavedEvents(currentUserId),
    ]);

    if (registrationsRes.error) {
      setPageError(registrationsRes.error.message);
    } else {
      setRegistrations((registrationsRes.data ?? []) as RegistrationWithEvent[]);
    }

    if (feedbacksRes.error) {
      setPageError(feedbacksRes.error.message);
    } else {
      setFeedbacks((feedbacksRes.data ?? []) as FeedbackWithEvent[]);
    }

    if (savedRes.error) {
      setPageError(savedRes.error.message);
    } else {
      setSavedRows((savedRes.data ?? []) as SavedEventWithEvent[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboardData();
  }, [currentUserId]);

  const savedEventIds = useMemo(() => {
    return savedRows.map((item) => Number(item.event_id));
  }, [savedRows]);

  const registrationEventIds = useMemo(() => {
    return registrations.map((item) => Number(item.event_id));
  }, [registrations]);

  const registeredCount = useMemo(() => {
    return registrations.filter((r) => r.registration_status === "confirmed")
      .length;
  }, [registrations]);

  const waitlistedCount = useMemo(() => {
    return registrations.filter((r) => r.registration_status === "waitlisted")
      .length;
  }, [registrations]);

  const feedbackCount = feedbacks.length;
  const savedCount = savedRows.length;

  const recentRegistrations = useMemo(() => {
    return [...registrations]
      .sort((a, b) => {
        const dateA = a.registered_at ? new Date(a.registered_at).getTime() : 0;
        const dateB = b.registered_at ? new Date(b.registered_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [registrations]);

  const recentFeedbacks = useMemo(() => {
    return [...feedbacks]
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [feedbacks]);

  const recentSavedEvents = useMemo(() => {
    return [...savedRows]
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [savedRows]);

  async function handleToggleSave(eventId: number) {
    const isSaved = savedEventIds.includes(eventId);

    if (isSaved) {
      await removeSaved(eventId);
    } else {
      await addSaved(eventId);
    }

    await loadDashboardData();
  }

  async function handleRegister(event: Event) {
    const result = await toggleRegistration(event.id, false, event.capacity);

    if (!result.ok) {
      setInfoDialog({
        isOpen: true,
        title: "Registration Not Available",
        message: result.message,
      });
      return;
    }

    setInfoDialog({
      isOpen: true,
      title:
        result.status === "waitlisted"
          ? "Added to Waiting List"
          : "Registration Successful",
      message: result.message,
    });

    await loadDashboardData();
  }

  function handleAskUnregister(event: Event) {
    setPendingUnregister({
      eventId: event.id,
      capacity: event.capacity,
    });
  }

  async function handleConfirmUnregister() {
    if (!pendingUnregister) return;

    const result = await toggleRegistration(
      pendingUnregister.eventId,
      true,
      pendingUnregister.capacity
    );

    setPendingUnregister(null);

    if (!result.ok) {
      setInfoDialog({
        isOpen: true,
        title: "Unable to Unregister",
        message: result.message,
      });
      return;
    }

    setInfoDialog({
      isOpen: true,
      title: "Unregistered",
      message: result.message,
    });

    await loadDashboardData();
  }

  function handleCancelUnregister() {
    setPendingUnregister(null);
  }

  function handleAskDeleteFeedback(feedbackId: number) {
    setPendingDeleteFeedbackId(feedbackId);
  }

  async function handleConfirmDeleteFeedback() {
    if (pendingDeleteFeedbackId === null) return;

    await deleteFeedbackById(pendingDeleteFeedbackId);
    setPendingDeleteFeedbackId(null);
    await loadDashboardData();
  }

  function handleCancelDeleteFeedback() {
    setPendingDeleteFeedbackId(null);
  }

  if (loading) {
    return <Loader />;
  }

  if (pageError) {
    return <p className={styles.loading}>{pageError}</p>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        <h2 className={styles.title}>Volunteer Dashboard</h2>

        <div className={styles.stats}>
          <div className={styles.card}>
            <h3>{registeredCount}</h3>
            <p>Registered Events</p>
          </div>

          <div className={styles.card}>
            <h3>{savedCount}</h3>
            <p>Saved Events</p>
          </div>

          <div className={styles.card}>
            <h3>{feedbackCount}</h3>
            <p>My Feedbacks</p>
          </div>

          <div className={styles.card}>
            <h3>{waitlistedCount}</h3>
            <p>Waitlisted Events</p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>My Registrations</h3>
            <button
              className={styles.viewMoreBtn}
              onClick={() => navigate("/user-registrations")}
            >
              Show More
            </button>
          </div>

          <div className={styles.cardGrid}>
            {recentRegistrations.length === 0 ? (
              <p className={styles.emptyText}>No registered events yet.</p>
            ) : (
              recentRegistrations.map((registration) => {
                const event = getEventFromField(registration.Events);

                return (
                  <div
                    key={registration.id}
                    className={styles.eventCard}
                    onClick={() => goToEventDetails(Number(registration.event_id))}
                  >
                    <img
                      src={event?.image || "/default-event.jpg"}
                      alt={event?.title || "Event"}
                      className={styles.eventImage}
                    />

                    <div className={styles.eventInfo}>
                      <div className={styles.eventTop}>
                        <h4>{event?.title || `Event #${registration.event_id}`}</h4>
                        <span
                          className={`${styles.statusBadge} ${
                            registration.registration_status === "waitlisted"
                              ? styles.waitlisted
                              : styles.confirmed
                          }`}
                        >
                          {registration.registration_status}
                        </span>
                      </div>

                      {event?.event_date && (
                        <p>{new Date(event.event_date).toLocaleDateString()}</p>
                      )}
                      {event?.location && <p>{event.location}</p>}
                    </div>

                    <div className={styles.actions}>
                      <button
                        className={styles.secondaryBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(Number(registration.event_id));
                        }}
                      >
                        {savedEventIds.includes(Number(registration.event_id))
                          ? "Unsave"
                          : "Save"}
                      </button>

                      {event && (
                        <button
                          className={styles.dangerBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAskUnregister(event);
                          }}
                        >
                          Unregister
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Recent Feedbacks</h3>
            <button
              className={styles.viewMoreBtn}
              onClick={() => navigate("/my-feedbacks")}
            >
              Show More
            </button>
          </div>

          <div className={styles.cardGrid}>
            {recentFeedbacks.length === 0 ? (
              <p className={styles.emptyText}>No feedbacks yet.</p>
            ) : (
              recentFeedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className={styles.feedbackCard}
                  onClick={() => goToEventDetails(Number(feedback.event_id))}
                >
                  <div className={styles.feedbackTop}>
                    <div>
                      <h4>{feedback.Events?.title || "Event Feedback"}</h4>
                      <p>
                        {feedback.created_at
                          ? new Date(feedback.created_at).toLocaleDateString()
                          : "No date"}
                      </p>
                    </div>

                    <span className={styles.ratingBadge}>
                      {feedback.rating}/5
                    </span>
                  </div>

                  <p className={styles.feedbackText}>{feedback.comment}</p>

                  <div className={styles.actions}>
                    <button
                      className={styles.secondaryBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/events/${feedback.event_id}`, {
                          state: {
                            openReviewForm: true,
                            editFeedbackId: feedback.id,
                            initialComment: feedback.comment,
                            initialRating: feedback.rating,
                          },
                        });
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className={styles.dangerBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAskDeleteFeedback(feedback.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Saved Events</h3>
            <button
              className={styles.viewMoreBtn}
              onClick={() => navigate("/saved-events")}
            >
              Show More
            </button>
          </div>

          <div className={styles.cardGrid}>
            {recentSavedEvents.length === 0 ? (
              <p className={styles.emptyText}>No saved events yet.</p>
            ) : (
              recentSavedEvents.map((savedItem) => {
                const event = getEventFromField(savedItem.Events);
                if (!event) return null;

                const isRegistered = registrationEventIds.includes(event.id);

                return (
                  <div
                    key={savedItem.id}
                    className={styles.eventCard}
                    onClick={() => goToEventDetails(event.id)}
                  >
                    <img
                      src={event.image || "/default-event.jpg"}
                      alt={event.title}
                      className={styles.eventImage}
                    />

                    <div className={styles.eventInfo}>
                      <h4>{event.title}</h4>
                      <p>{new Date(event.event_date).toLocaleDateString()}</p>
                      <p>{event.location}</p>
                    </div>

                    <div className={styles.actions}>
                      <button
                        className={styles.secondaryBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(event.id);
                        }}
                      >
                        Unsave
                      </button>

                      <button
                        className={
                          isRegistered ? styles.dangerBtn : styles.primaryBtn
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          isRegistered
                            ? handleAskUnregister(event)
                            : handleRegister(event);
                        }}
                      >
                        {isRegistered ? "Unregister" : "Register"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.addSection}>
          <h3>Browse More Events</h3>
          <p>
            Explore more opportunities, save your favorite events, and register
            for new experiences.
          </p>
          <button onClick={() => navigate("/events")}>Browse Events</button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={pendingUnregister !== null}
        title="Unregister from Event"
        message="Are you sure you want to unregister from this event?"
        confirmText="Yes, unregister"
        cancelText="Cancel"
        onConfirm={handleConfirmUnregister}
        onCancel={handleCancelUnregister}
      />

      <ConfirmationDialog
        isOpen={pendingDeleteFeedbackId !== null}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback?"
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDeleteFeedback}
        onCancel={handleCancelDeleteFeedback}
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