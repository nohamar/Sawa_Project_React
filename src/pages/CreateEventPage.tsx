import { useEffect, useState } from "react";
import EventForm from "../components/events/EventForm";
import { useEvents } from "../hooks/useEvents";
import type { CreateEvent, UpdateEvent } from "../types/events";


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

  const handleSubmit = (data: CreateEvent | UpdateEvent) => {
    return addEvent(data as CreateEvent);
  };

  return (
    <EventForm
    initialData={null}
      userId={userId}
      onSubmit={handleSubmit}
      error={error}
      successMessage={successMessage}
    />
  );
};

export default CreateEventPage;