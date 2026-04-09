import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { EventDetails } from "../components/events/EventDetailsCard";

import { useEvents } from "../hooks/useEvents";
import { useRegister } from "../hooks/useRegister";
import type { Profile } from "../types/profile";
import type { Registration } from "../types/registration";
import type { CardAction } from "../components/events/EventDetailsCard";
import { getRegistration_Event } from "../services/registration";
import { updateEventStatus } from "../services/eventService";
import { getEventStatus } from "../utils/eventStatus";
import styles from "../css/EventDetails.module.css";

type Props = { profile: Profile | null };

export default function EventDetailsPage({ profile }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { registeredEventIds, toggleRegistration } = useRegister(profile?.id || null);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [status, setStatus] = useState("upcoming");

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  const event = events.find(e => Number(e.id) === Number(id));
  const isOwner = profile?.id === event?.organizer_id;
  const isVolunteer = profile?.role === "volunteer";
  const isLoggedIn = !!profile;
  const isRegistered = event ? registeredEventIds.includes(event.id) : false;


  useEffect(() => {
    async function fetchRegistrations() {
      if (!event) return;
      const { data, error } = await getRegistration_Event(event.id.toString());
      if (error) console.error(error);
      else {
        setRegistrations(data ?? []);
        setRegisteredCount((data ?? []).filter(r => r.registration_status === "confirmed").length);
      }
    }
    fetchRegistrations();
  }, [event, registeredEventIds]);

  useEffect(() => {
    if (!event) return;
    const calculatedStatus = getEventStatus(
      event.event_date,
      event.end_time,
      event.capacity,
      registeredCount
    );
    setStatus(calculatedStatus);
    if (event.status !== calculatedStatus) updateEventStatus(event.id, calculatedStatus);
  }, [event, registeredCount]);

  const actions: CardAction[] = [];

  if (event && !isOwner && isLoggedIn  && isVolunteer) {
    actions.push({
      label: isRegistered ? "✓ Registered" : "Register for this event",
      onClick: () => toggleRegistration(event.id, isRegistered),
      className: isRegistered ? styles.btnDone : styles.btnReg,
    });
     actions.push({
        label: "Saved",
        onClick: () => console.log("saved", event.id),
        className: `${styles.btn} ${styles.btnSaved}`,
      });
      actions.push({
      label: "Give Feedback",
      onClick: () => setShowFeedback(true),
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
      onClick: () => console.log("Delete event", event.id),
      className: `${styles.btn} ${styles.btnDelete}`,
    });
  }

  if (eventsLoading) return <p>Loading event...</p>;
  if (eventsError) return <p>Error loading event: {eventsError}</p>;
  if (!event) return <p>Event not found</p>;

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) return;

    //  connect to Supabase
    setFeedback("");
    setShowFeedback(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className={styles.hero} style={{ backgroundImage: `url(${event.image})` }}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Join the {event.title}</h1>
          <p className={styles.heroSubtitle}>
            Don’t miss out! Check out all the details and secure your spot today.
          </p>
        </div>
      </div>

      <EventDetails
        event={event}
        registrations={registrations}
        registeredCount={registeredCount}
        status={status}
        actions={actions}
      />

          {showFeedback && (
        <div className={styles.card} style={{ marginTop: "1rem" }}>
          <h3>Leave Feedback</h3>

          <textarea
            className={styles.textarea}
            placeholder="Write your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <button className={styles.btn} onClick={handleSubmitFeedback}>
            Submit
          </button>
        </div>
      )}
    </div>
    
  );
}