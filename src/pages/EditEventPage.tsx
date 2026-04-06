import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../services/eventService";
import { useEvents } from "../hooks/useEvents";
import type { Event } from "../types/events";
import EventForm from "../components/events/EventForm";

const EditEventPage = () => {
  const { id } = useParams();
  const { editEvent, error, successMessage } = useEvents();

  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;
      const { data } = await getEventById(id);
      setEvent(data);
    }

    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <EventForm
      initialData={event}
      isEdit
      onSubmit={(data) => editEvent(id!, data)}
      error={error}
      successMessage={successMessage}
    />
  );
};

export default EditEventPage;