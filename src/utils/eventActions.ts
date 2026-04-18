
import type { Event } from "../types/events";

export function getEventPermissions(
  event: Event,
  currentUserId: number | null,
  role?: "organizer" | "volunteer" | null
) {
  const isOwner = currentUserId === event.organizer_id;

  return {
    isOwner,
    canEdit: isOwner,
    canDelete: isOwner,
    canRegister: !isOwner && role === "volunteer",
  };
}