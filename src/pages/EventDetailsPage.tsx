import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useRegister } from "../hooks/useRegister";
import { EventDetails } from "../components/events/EventDetailsCard";
import type { Profile } from "../types/profile";
import styles from "../css/EventDetails.module.css"
import heroImage from "../images/event_hero.jpg";

type Props = {
  profile: Profile | null;
};

export default function EventDetailsPage({ profile }: Props) {
  const { id } = useParams(); // get event ID from URL
  const navigate = useNavigate();

  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { registeredEventIds, toggleRegistration, loading: regLoading, error: regError } = useRegister(profile?.id || null);

  if (eventsLoading) return <p>Loading event...</p>;
  if (eventsError) return <p>Error loading event: {eventsError}</p>;

  const event = events.find((e) => Number(e.id) === Number(id));
  if (!event) return <p>Event not found</p>;

const isOwner =
  profile?.id && event.organizer_id
    ? String(profile.id) === String(event.organizer_id)
    : false;

  // Handle Edit button
  const handleEdit = () => {
    navigate(`/organizer-dashboard/edit-event/${event.id}`);
  };

  // Handle Delete button
  const handleDelete = (eventId: number) => {
    console.log("Delete event", eventId);
    // call delete hook/service here
  };

  // Handle Registration button
  const handleRegister = async (eventId: number, isRegistered: boolean) => {
    await toggleRegistration(eventId, isRegistered);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Join the {event.title}</h1>
        <p className={styles.heroSubtitle}>Don’t miss out! Check out all the details and secure your spot today.</p>
      </div>
      </div>
   
      {regError && <p className="text-red-500 mb-2">{regError}</p>}
      <EventDetails
        event={event}
        currentUserId={profile?.id || null} 
        onEdit={isOwner ? handleEdit : undefined}
        onDelete={isOwner ? handleDelete : undefined}
        onRegister={!isOwner ? handleRegister : undefined}
        isRegistered={registeredEventIds.includes(Number(event.id))}
      />

      {regLoading && <p className="mt-2 text-gray-500">Updating registration...</p>}
    </div>
  );
}