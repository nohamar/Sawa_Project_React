import { useState, useEffect } from "react";
import {
  createRegistration,
  deleteRegistration,
  getRegistration_User,
} from "../services/registration";

export function useRegister(volunteerId: number | null) {
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load events this volunteer is registered for
  async function loadRegisteredEvents() {
    if (volunteerId === null) return;
    setLoading(true);
    setError("");

    try {
      const { data, error } = await getRegistration_User(volunteerId);
      if (error) throw error;

      // Extract event IDs
      setRegisteredEventIds(data?.map((r) => r.event_id) ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }

  // Register or unregister for an event
  async function toggleRegistration(eventId: number, isRegistered: boolean) {
    if (volunteerId === null) return;
    setLoading(true);
    setError("");

    try {
      if (!isRegistered) {
        // Register
        const { error } = await createRegistration({
          event_id: eventId,
          volunteer_id: volunteerId,
          registration_status: "confirmed",
          attendance_status: "pending",
        });
        if (error) throw error;
      } else {
        // Unregister
        const { data, error } = await getRegistration_User(volunteerId);
        if (error) throw error;

        const reg = data?.find((r) => r.event_id === eventId);
        if (reg) {
          const { error: delError } = await deleteRegistration(reg.id);
          if (delError) throw delError;
        }
      }

      // Refresh
      await loadRegisteredEvents();
    } catch (err: any) {
      setError(err.message || "Failed to update registration");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRegisteredEvents();
  }, [volunteerId]);

  return { registeredEventIds, loading, error, loadRegisteredEvents, toggleRegistration };
}