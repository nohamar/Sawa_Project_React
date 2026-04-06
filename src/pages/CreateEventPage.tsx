import { useEffect, useState } from "react";
import EventForm from "../components/events/EventForm";
import { useEvents } from "../hooks/useEvents";


type CreateEventPageProps = {
  userId?: number;
};

const CreateEventPage = ({ userId }: CreateEventPageProps) => {
  const { addEvent, error, successMessage } = useEvents();
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!userId) setLocalError("User not authenticated");
  }, [userId]);

  if (!userId) return <p className="error-msg">{localError || "Checking authentication..."}</p>;

  return (
    <EventForm
      userId={userId}
      onSubmit={addEvent}
      error={error}
      successMessage={successMessage}
    />
  );
};

export default CreateEventPage;