import { useState, useEffect } from "react";
import {
  createRegistration,
  deleteRegistration,
  getRegistration_User,
  getRegistration_Event,
  getAllRegistrations,
} from "../services/registration";
import { getEventById } from "../services/eventService";

import type { Event } from "../types/events";
import type {
  Registration,
  RegistrationStatus,
  RegistrationWithEvent,
} from "../types/registration";

export function useRegister(volunteerId: number | null) {
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [registrationStatusByEvent, setRegistrationStatusByEvent] = useState<
    Record<number, RegistrationStatus>
  >({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadRegisteredEvents() {
    if (volunteerId === null) {
      setRegisteredEventIds([]);
      setRegisteredEvents([]);
      setRegistrationStatusByEvent({});
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await getRegistration_User(String(volunteerId));
      if (error) throw error;

      const rows = (data ?? []) as RegistrationWithEvent[];

      const eventIds = rows.map((r) => Number(r.event_id));
      setRegisteredEventIds(eventIds);

      const statusMap: Record<number, RegistrationStatus> = {};
      rows.forEach((row) => {
        statusMap[Number(row.event_id)] = row.registration_status;
      });
      setRegistrationStatusByEvent(statusMap);

      const eventsOnly = rows.flatMap((row) => {
        if (Array.isArray(row.Events)) return row.Events;
        return row.Events ? [row.Events] : [];
      });

      setRegisteredEvents(eventsOnly);
    } catch (err: any) {
      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }

  async function loadAllRegistrations() {
    try {
      const { data, error } = await getAllRegistrations();
      if (error) throw error;

      setAllRegistrations((data ?? []) as Registration[]);
    } catch (err: any) {
      setError(err.message || "Failed to load all registrations");
    }
  }

  async function toggleRegistration(
    eventId: number,
    isRegistered: boolean,
    capacity?: number
  ) {
    if (volunteerId === null) {
      return {
        ok: false,
        status: null as RegistrationStatus | null,
        message: "User is not logged in.",
      };
    }

    setLoading(true);
    setError("");

    try {
      if (!isRegistered) {
        const { data: eventData, error: eventDataError } = await getEventById(eventId);

        if (eventDataError) throw eventDataError;

        if (eventData?.status?.toLowerCase() === "completed") {
          return {
            ok: false,
            status: null as RegistrationStatus | null,
            message: "This event has already been completed and cannot be registered.",
          };
        }

        const { data: eventRegistrations, error: eventError } =
          await getRegistration_Event(String(eventId));

        if (eventError) throw eventError;

        const rows = (eventRegistrations ?? []) as Registration[];

        const confirmedCount = rows.filter(
          (r) => r.registration_status === "confirmed"
        ).length;

        const waitlistedCount = rows.filter(
          (r) => r.registration_status === "waitlisted"
        ).length;

        const nextStatus: RegistrationStatus =
          capacity !== undefined && confirmedCount >= capacity
            ? "waitlisted"
            : "confirmed";

        const { error } = await createRegistration({
          event_id: eventId,
          volunteer_id: volunteerId,
          registration_status: nextStatus,
          attendance_status: "pending",
          waitlist_position:
            nextStatus === "waitlisted" ? waitlistedCount + 1 : null,
        });

        if (error) throw error;

        await loadRegisteredEvents();
        await loadAllRegistrations();

        return {
          ok: true,
          status: nextStatus,
          message:
            nextStatus === "waitlisted"
              ? "The event is full. You have been added to the waiting list."
              : "You have been registered successfully.",
        };
      } else {
        const { data, error } = await getRegistration_User(String(volunteerId));
        if (error) throw error;

        const reg = data?.find((r: any) => Number(r.event_id) === eventId);

        if (reg) {
          const { error: delError } = await deleteRegistration(String(reg.id));
          if (delError) throw delError;
        }

        await loadRegisteredEvents();
        await loadAllRegistrations();

        return {
          ok: true,
          status: null as RegistrationStatus | null,
          message:
            "You have been unregistered. If there was someone on the waiting list, they have been moved to the participants list.",
        };
      }
    } catch (err: any) {
      const message = err.message || "Failed to update registration";
      setError(message);

      return {
        ok: false,
        status: null as RegistrationStatus | null,
        message,
      };
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRegisteredEvents();
    loadAllRegistrations();
  }, [volunteerId]);

  return {
    registeredEventIds,
    registeredEvents,
    allRegistrations,
    registrationStatusByEvent,
    toggleRegistration,
    loadRegisteredEvents,
    loadAllRegistrations,
    loading,
    error,
  };
}