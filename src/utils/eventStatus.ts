// utils/eventStatus.ts
import type { EventStatus } from "../types/events";

export function getEventStatus(
  event_date: string,
  end_time: string,
  capacity?: number,
  registeredCount?: number
): EventStatus {
  const now = new Date();
  const eventEnd = new Date(`${event_date}T${end_time}`);

  if (eventEnd < now) return "completed";

  if (capacity && registeredCount && registeredCount >= capacity) {
    return "closed";
  }

  return "upcoming";
}