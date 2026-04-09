import type { EventStatus } from "../types/events";

export function getEventStatus(
  event_date: string,   // "2026-04-09"
  end_time: string,     // "18:30"
  capacity?: number,
  registeredCount?: number
): EventStatus {
  const [year, month, day] = event_date.split("-").map(Number);
  const [hours, minutes] = end_time.split(":").map(Number);

  // Month is 0-indexed in JS Date
  const eventEnd = new Date(year, month - 1, day, hours, minutes, 0);

  const now = new Date();

  if (eventEnd < now) return "completed";
  if (capacity && registeredCount && registeredCount >= capacity) return "closed";
  return "upcoming";
}