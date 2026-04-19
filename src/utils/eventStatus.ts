import type { EventStatus } from "../types/events";

export function getEventStatus(
  event_date: string,
  end_time: string,
  capacity?: number,
  registeredCount: number = 0
): EventStatus {
  const [year, month, day] = event_date.split("-").map(Number);
  const [hours, minutes] = end_time.split(":").map(Number);

  const eventEnd = new Date(year, month - 1, day, hours, minutes);
  const now = new Date();

  if (eventEnd < now) return "completed";

  if (capacity !== undefined && registeredCount >= capacity) {
    return "closed";
  }

  return "upcoming";
}