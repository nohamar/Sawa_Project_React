import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import { EventDetails } from "../components/events/EventDetailsCard";
import FeedbackList from "../components/feedback/FeedbackList";
import type { FeedbackCardAction } from "../components/feedback/FeedbackCard";
import type { CardAction } from "../components/events/EventDetailsCard";
import ProfileCard from "../components/profile/ProfileCard";

import ParticipantTable from "../components/registrations/ParticipantTable";
import WaitlistTable from "../components/registrations/WaitlistTable";
import Loader from "../components/shared/Loader";
import ConfirmationDialog from "../components/shared/ConfirmationDialog";

import { useEvents } from "../hooks/useEvents";
import { useRegister } from "../hooks/useRegister";
import { useSaved } from "../hooks/useSaved";
import { useEventFeedbacks } from "../hooks/useEventFeedback";

import type { Profile } from "../types/profile";
import type {
  AttendanceStatus,
  RegistrationWithVolunteer,
} from "../types/registration";
import type { Feedback, FeedbackWithEventAndProfile } from "../types/feedback";

import {
  getRegistration_Event,
  updateAttendanceStatus,
} from "../services/registration";
import { updateEventStatus } from "../services/eventService";
import { getEventStatus } from "../utils/eventStatus";

import styles from "../css/EventDetails.module.css";

type Props = {
  profile: Profile | null;
};

type EditFeedbackLocationState = {
  openReviewForm?: boolean;
  editFeedbackId?: number;
  initialComment?: string;
  initialRating?: number;
};

export default function EventDetailsPage({ profile }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [pendingDeleteFeedbackId, setPendingDeleteFeedbackId] = useState<
    number | null
  >(null);
  const locationState =
    (location.state as EditFeedbackLocationState | null) ?? null;

  const openReviewFormFromState = locationState?.openReviewForm ?? false;
  const editFeedbackIdFromState = locationState?.editFeedbackId ?? null;
  const initialCommentFromState = locationState?.initialComment ?? "";
  const initialRatingFromState = locationState?.initialRating ?? 0;

  const eventIdNumber = id ? Number(id) : null;
  const feedbackVolunteerId = profile?.id ?? null;

  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [infoDialog, setInfoDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    removeEvent,
    loadEvents,
  } = useEvents();

  const { registeredEventIds, toggleRegistration } = useRegister(
    profile?.id ?? null
  );

  const { saved, addSaved, removeSaved } = useSaved(profile?.id ?? null);

  const {
    feedbacks,
    loading: feedbackLoading,
    error: feedbackError,
    successMessage: feedbackSuccess,
    addFeedback,
    editFeedbackById,
    deleteFeedbackById,
  } = useEventFeedbacks(eventIdNumber, feedbackVolunteerId);

  const [registrations, setRegistrations] = useState<
    RegistrationWithVolunteer[]
  >([]);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [status, setStatus] = useState("upcoming");

  const [formComment, setFormComment] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [editingFeedbackId, setEditingFeedbackId] = useState<number | null>(
    null
  );

  useEffect(() => {
    loadEvents();
  }, []);

  const event = events.find((e) => Number(e.id) === Number(id));

  const isOwner = profile?.id === event?.organizer_id;
  const isVolunteer = profile?.role === "volunteer";
  const isLoggedIn = !!profile;
  const isRegistered = event ? registeredEventIds.includes(event.id) : false;
  const isSaved = event ? saved.some((item) => item.id === event.id) : false;

  useEffect(() => {
    if (openReviewFormFromState && editFeedbackIdFromState !== null) {
      setEditingFeedbackId(editFeedbackIdFromState);
      setFormComment(initialCommentFromState);
      setFormRating(initialRatingFromState);

      setTimeout(() => {
        document
          .getElementById("review-form")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 0);

      navigate(location.pathname, { replace: true, state: null });
    }
  }, [
    openReviewFormFromState,
    editFeedbackIdFromState,
    initialCommentFromState,
    initialRatingFromState,
    navigate,
    location.pathname,
  ]);

  async function handleDeleteEvent(currentEvent: any) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    const result = await removeEvent(currentEvent);
    if (!result) {
      alert("Delete failed");
    }
    navigate("/events");
  }

async function fetchRegistrations() {
  if (!event) return;

  const { data, error } = await getRegistration_Event(String(event.id));

  if (error) {
    console.error(error);
    return;
  }

  const mergedRows: RegistrationWithVolunteer[] = (data ?? []).map((row: any) => ({
    id: row.id,
    registration_status: row.registration_status,
    attendance_status: row.attendance_status,
    registered_at: row.registered_at,
    event_id: row.event_id,
    volunteer_id: row.volunteer_id,
    waitlist_position: row.waitlist_position,
    profile: row.profile ?? null,
  }));

  setRegistrations(mergedRows);
  setRegisteredCount(
    mergedRows.filter((r) => r.registration_status === "confirmed").length
  );
}


  useEffect(() => {
    fetchRegistrations();
  }, [event, registeredEventIds]);

  useEffect(() => {
    if (!event) return;

    const confirmedCount = registrations.filter(
      (r) => r.registration_status === "confirmed"
    ).length;

    const calculatedStatus = getEventStatus(
      event.event_date,
      event.end_time,
      event.capacity,
      confirmedCount
    );

    setRegisteredCount(confirmedCount);
    setStatus(calculatedStatus);

    if (event.status !== calculatedStatus) {
      updateEventStatus(event.id, calculatedStatus);
    }
  }, [event, registrations]);

  async function handleAttendanceChange(
    registrationId: number,
    attendance: AttendanceStatus
  ) {
    const { error } = await updateAttendanceStatus(registrationId, attendance);
    if (!error) {
      await fetchRegistrations();
    }
  }

  async function handleSaveToggle() {
    if (!event) return;

    if (isSaved) {
      await removeSaved(event.id);
    } else {
      await addSaved(event.id);
    }
  }

  async function handleRegisterToggle() {
    if (!event) return;

    if (isRegistered) {
      setIsRegisterDialogOpen(true);
      return;
    }

    const result = await toggleRegistration(event.id, false, event.capacity);

    if (!result.ok) return;

    setInfoDialog({
      isOpen: true,
      title:
        result.status === "waitlisted"
          ? "Added to Waiting List"
          : "Registration Successful",
      message: result.message,
    });
  }

  async function handleConfirmUnregister() {
    if (!event) return;

    const result = await toggleRegistration(event.id, true, event.capacity);
    setIsRegisterDialogOpen(false);

    if (!result.ok) return;

    setInfoDialog({
      isOpen: true,
      title: "Unregistered",
      message: result.message,
    });
  }

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formComment.trim() || !formRating) return;

    if (editingFeedbackId !== null) {
      await editFeedbackById(editingFeedbackId, formComment, formRating);
    } else {
      await addFeedback(formComment, formRating);
    }

    setFormComment("");
    setFormRating(0);
    setEditingFeedbackId(null);
  }

  function handleAskDeleteFeedback(feedbackId: number) {
    setPendingDeleteFeedbackId(feedbackId);
  }

  async function handleConfirmDeleteFeedback() {
    if (pendingDeleteFeedbackId === null) return;

    await deleteFeedbackById(pendingDeleteFeedbackId);

    if (editingFeedbackId === pendingDeleteFeedbackId) {
      setFormComment("");
      setFormRating(0);
      setEditingFeedbackId(null);
    }

    setPendingDeleteFeedbackId(null);
  }

  function handleCancelDeleteFeedback() {
    setPendingDeleteFeedbackId(null);
  }

  function handleStartNewFeedback() {
    setEditingFeedbackId(null);
    setFormComment("");
    setFormRating(0);

    document
      .getElementById("review-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  const actions: CardAction[] = [];

  if (event && !isOwner && isLoggedIn && isVolunteer) {
    actions.push({
      label: isRegistered ? "Unregister" : "Register",
      onClick: () => handleRegisterToggle(),
      className: isRegistered ? styles.btnDone : styles.btnReg,
    });

    actions.push({
      label: isSaved ? "Unsave" : "Save",
      onClick: () => handleSaveToggle(),
      className: `${styles.btn} ${styles.btnSaved}`,
    });

    actions.push({
      label: "Add Feedback",
      onClick: () => handleStartNewFeedback(),
      className: `${styles.btn}`,
    });
  }

  if (event && isOwner) {
    actions.push({
      label: "Edit",
      onClick: () => navigate(`/organizer-dashboard/edit-event/${event.id}`),
      className: `${styles.btn} ${styles.btnEdit}`,
    });

    actions.push({
      label: "Delete",
      onClick: () => handleDeleteEvent(event),
      className: `${styles.btn} ${styles.btnDelete}`,
    });
  }

  const confirmedRegistrations = useMemo(
    () => registrations.filter((r) => r.registration_status === "confirmed"),
    [registrations]
  );

  const waitlistRegistrations = useMemo(
    () => registrations.filter((r) => r.registration_status === "waitlisted"),
    [registrations]
  );

  const feedbackActions = (feedback: Feedback): FeedbackCardAction[] => {
    if (!isVolunteer) return [];
    if (Number(feedback.volunteer_id) !== Number(profile?.id)) return [];

    return [
      {
        label: "Edit",
        onClick: () => {
          setEditingFeedbackId(feedback.id);
          setFormComment(feedback.comment);
          setFormRating(feedback.rating);

          document
            .getElementById("review-form")
            ?.scrollIntoView({ behavior: "smooth" });
        },
        className: styles.feedbackActionBtn,
      },
      {
        label: "Delete",
        onClick: () => handleAskDeleteFeedback(feedback.id),
        className: styles.feedbackActionBtn,
      },
    ];
  };

  if (eventsLoading) return <Loader />;
  if (eventsError) return <p>Error loading event: {eventsError}</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <div className={styles.page}>
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(/images/event_hero.jpg)` }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Join the {event.title}</h1>
          <p className={styles.heroSubtitle}>
            Check out and secure your spot today.
          </p>
          <button
            className={styles.heroBtn}
            onClick={() =>
              document
                .getElementById("details")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Event
          </button>
        </div>
      </div>

      <div id="details" className={styles.container}>
        <EventDetails
          event={event}
          registrations={registrations}
          registeredCount={registeredCount}
          status={status}
          actions={actions}
        />

        <section className={styles.feedbackSection}>
          <div className={styles.feedbackColumn}>
            <h2 className={styles.sectionTitle}>Recent Feedbacks</h2>

            {feedbackLoading ? (
              <p>Loading feedbacks...</p>
            ) : feedbackError ? (
              <p>{feedbackError}</p>
            ) : feedbacks.length === 0 ? (
              <p>No feedback has been added yet.</p>
            ) : (
              <FeedbackList
                feedbacks={feedbacks}
                getActions={feedbackActions}
                renderProfileSection={(feedback) => {
                  const currentFeedback =
                    feedback as FeedbackWithEventAndProfile;

                  const author = currentFeedback.profile;

                  return (
                    <ProfileCard
                      fullName={
                        author
                          ? `${author.first_name} ${author.second_name}`
                          : "User"
                      }
                      avatar={author?.avatar ?? null}
                      email={author?.email}
                      role={author?.role ?? "Volunteer"}
                      size="sm"
                      variant="feedback"
                    />
                  );
                }}
              />
            )}
          </div>

          {isVolunteer && isLoggedIn && (
            <div className={styles.reviewFormColumn} id="review-form">
              <h2 className={styles.sectionTitle}>
                {editingFeedbackId !== null ? "Edit Review" : "Add a Review"}
              </h2>

              {feedbackSuccess && (
                <p className={styles.successText}>{feedbackSuccess}</p>
              )}

              <form
                className={styles.reviewForm}
                onSubmit={handleFeedbackSubmit}
              >
                <label className={styles.formLabel}>Add Your Rating</label>
                <select
                  className={styles.formInput}
                  value={formRating}
                  onChange={(e) => setFormRating(Number(e.target.value))}
                >
                  <option value={0}>Choose rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>

                <label className={styles.formLabel}>Name</label>
                <input
                  className={styles.formInput}
                  readOnly
                  value={
                    profile
                      ? `${profile.first_name} ${profile.second_name}`
                      : ""
                  }
                />

                <label className={styles.formLabel}>Email</label>
                <input
                  className={styles.formInput}
                  readOnly
                  value={profile?.email ?? ""}
                />

                <label className={styles.formLabel}>Write Your Review</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Write your review here..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                />

                <div className={styles.formButtons}>
                  <button className={styles.submitBtn} type="submit">
                    {editingFeedbackId !== null ? "Update" : "Submit"}
                  </button>

                  {editingFeedbackId !== null && (
                    <button
                      type="button"
                      className={styles.feedbackActionBtn}
                      onClick={handleStartNewFeedback}
                    >
                      Add New Feedback
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </section>

        {(isOwner || isVolunteer) && (
          <section className={styles.organizerSection}>
            <ParticipantTable
              items={confirmedRegistrations}
              onAttendanceChange={isOwner ? handleAttendanceChange : undefined}
              showAttendanceControls={isOwner}
            />
            <WaitlistTable items={waitlistRegistrations} />
          </section>
        )}
      </div>

      <ConfirmationDialog
        isOpen={isRegisterDialogOpen}
        title="Unregister from Event"
        message="Are you sure you want to unregister from this event?"
        confirmText="Yes, unregister"
        cancelText="Cancel"
        onConfirm={handleConfirmUnregister}
        onCancel={() => setIsRegisterDialogOpen(false)}
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

      <ConfirmationDialog
        isOpen={pendingDeleteFeedbackId !== null}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback?"
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDeleteFeedback}
        onCancel={handleCancelDeleteFeedback}
      />
    </div>
  );
}