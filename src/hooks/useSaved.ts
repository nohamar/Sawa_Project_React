import { useEffect, useState } from "react";
import {
  getSavedEvents,
  removeSavedEvent,
  saveSavedEvent,
} from "../services/savedEventService";
import { getEventById } from "../services/eventService";

import type { Event } from "../types/events";
import type { SavedEventWithEvent } from "../types/saved";

export function useSaved(volunteerId: number | null) {
  const [saved, setSaved] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadSaved(currentVolunteerId: number | null) {
    if (!currentVolunteerId) {
      setSaved([]);
      return;
    }

    setLoading(true);
    setError("");

    const { data, error } = await getSavedEvents(currentVolunteerId);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as SavedEventWithEvent[];

    const eventsOnly = rows.flatMap((item) => {
      if (Array.isArray(item.Events)) return item.Events;
      return item.Events ? [item.Events] : [];
    });

    setSaved(eventsOnly);
    setLoading(false);
  }

  async function addSaved(eventId: number) {
    if (!volunteerId) {
      setError("User is not logged in.");
      return false;
    }

    clearMessages();

    setLoading(true);

    try {
      const { data: eventData, error: eventError } = await getEventById(eventId);

      if (eventError) {
        setError(eventError.message);
        return false;
      }

      if (eventData?.status?.toLowerCase() === "completed") {
        setError("This event has already been completed and cannot be saved.");
        return false;
      }

      const { error } = await saveSavedEvent(volunteerId, eventId);

      if (error) {
        setError(error.message);
        return false;
      }

      setSuccessMessage("Event saved successfully.");
      await loadSaved(volunteerId);
      return true;
    } finally {
      setLoading(false);
    }
  }

  async function removeSaved(eventId: number) {
    if (!volunteerId) {
      setError("User is not logged in.");
      return false;
    }

    clearMessages();

    const { error } = await removeSavedEvent(volunteerId, eventId);

    if (error) {
      setError(error.message);
      return false;
    }

    setSaved((prev) => prev.filter((event) => event.id !== eventId));
    setSuccessMessage("Event removed from saved.");
    return true;
  }

  function clearMessages() {
    setError("");
    setSuccessMessage("");
  }

  useEffect(() => {
    loadSaved(volunteerId);
  }, [volunteerId]);

  return {
    saved,
    loading,
    error,
    successMessage,
    loadSaved,
    addSaved,
    removeSaved,
  };
}