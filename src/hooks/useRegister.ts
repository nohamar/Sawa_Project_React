import { useState, useEffect } from "react";
import {
  createRegistration,
  deleteRegistration,
  getRegistration_User,
  getAllRegistrations,
} from "../services/registration";

export function useRegister(volunteerId: number | null) {
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);

  
  const [allRegistrations, setAllRegistrations] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  async function loadRegisteredEvents() {
    if (volunteerId === null) return;

    setLoading(true);
    setError("");

    try {
      const { data, error } = await getRegistration_User(String(volunteerId));
      if (error) throw error;

      const eventIds = data?.map((r) => Number(r.event_id)) ?? [];
      setRegisteredEventIds(eventIds);
    } catch (err: any) {
      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }


  async function loadAllRegistrations() {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await getAllRegistrations();
      if (error) throw error;

      setAllRegistrations(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load all registrations");
    } finally {
      setLoading(false);
    }
  }

  
  async function toggleRegistration(eventId: number, isRegistered: boolean) {
    if (volunteerId === null) return;

    setLoading(true);
    setError("");

    try {
      if (!isRegistered) {
        const { error } = await createRegistration({
          event_id: String(eventId),
          volunteer_id: volunteerId,
          registration_status: "confirmed",
          attendance_status: "pending",
        });

        if (error) throw error;
      } else {
        const { data, error } = await getRegistration_User(String(volunteerId));
        if (error) throw error;

        const reg = data?.find(
          (r) => Number(r.event_id) === eventId
        );

        if (reg) {
          const { error: delError } = await deleteRegistration(reg.id);
          if (delError) throw delError;
        }
      }

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

  return {
    
    registeredEventIds,
    toggleRegistration,
    loadRegisteredEvents,

    
    allRegistrations,
    loadAllRegistrations,

    // COMMON
    loading,
    error,
  };
}