import { useEffect, useState } from "react";
import type { Event, CreateEvent, UpdateEvent } from "../types/events";
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByOrganizer,
} from "../services/eventService";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const loadEvents = async () => {
    setLoading(true);
    clearMessages();

    const { data, error } = await getAllEvents();
    if (error) {
      setError(error.message );
      setLoading(false);
      return;
    }

    setEvents(data as Event[]  ?? []);
    setLoading(false);
  };

  const loadEventsByOrganizer = async (userId: number | string) => {
    setLoading(true);
    clearMessages();

    const { data, error } = await getEventsByOrganizer(userId.toString());
    if (error) {
      setError(error?.message || "Failed to load organizer events");
      setLoading(false);
      return;
    }

    setEvents(data ?? []);
    setLoading(false);
  };

  const addEvent = async (event: CreateEvent) => {
    clearMessages();
    const { error } = await createEvent(event);
    if (error) {
      setError(error.message );
      return false;
    }
    setSuccessMessage("Event created successfully.");
    await loadEvents();
    return true;
  };

  const editEvent = async (id: string, updatedData: UpdateEvent) => {
    clearMessages();
    const { error } = await updateEvent(id, updatedData);
    if (error) {
      setError(error?.message || "Failed to update event");
      return false;
    }
    setSuccessMessage("Event updated successfully.");
    await loadEvents();
    return true;
  };

  const removeEvent = async (event: Event) => {
  clearMessages();

  const { error } = await deleteEvent(
    String(event.id),
    event.image
  );

  if (error) {
    setError(error?.message || "Failed to delete event");
    return false;
  }

  
  setEvents((prev) => prev.filter((e) => e.id !== event.id));

  setSuccessMessage("Event deleted successfully.");
  return true;
};

  useEffect(() => {
    loadEvents();
  }, []);

  return {
    events,
    loading,
    error,
    successMessage,
    addEvent,
    editEvent,
    removeEvent,
    loadEventsByOrganizer,
    refreshEvents: loadEvents,
    clearMessages,
  };
}