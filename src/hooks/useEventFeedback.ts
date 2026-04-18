import { useEffect, useState } from "react";
import {
  createFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedbackById as deleteFeedbackByIdService,
} from "../services/feedbackService";
import type {
  FeedbackWithEventAndProfile,
  NewFeedback,
} from "../types/feedback";

export function useEventFeedbacks(
  eventId: number | null,
  volunteerId: number | null
) {
  const [feedbacks, setFeedbacks] = useState<FeedbackWithEventAndProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadEventFeedbacks(currentEventId: number | null = eventId) {
    if (!currentEventId) {
      setFeedbacks([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await getFeedback(currentEventId);

      if (error) {
        setError(error.message);
        return;
      }

      setFeedbacks((data as FeedbackWithEventAndProfile[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function addFeedback(comment: string, rating: number) {
    if (!eventId || !volunteerId) {
      setError("User or event is missing.");
      return false;
    }

    setError("");
    setSuccessMessage("");

    const payload: NewFeedback = {
      comment,
      rating,
      event_id: eventId,
      volunteer_id: volunteerId,
    };

    const { error } = await createFeedback(payload);

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Feedback added successfully.");
    await loadEventFeedbacks(eventId);
    return true;
  }

  async function editFeedbackById(
    feedbackId: number,
    comment: string,
    rating: number
  ) {
    setError("");
    setSuccessMessage("");

    const { error } = await updateFeedback(feedbackId, comment, rating);

    if (error) {
      setError(error.message || "Failed to update feedback.");
      return false;
    }

    setFeedbacks((prev) =>
      prev.map((item) =>
        item.id === feedbackId ? { ...item, comment, rating } : item
      )
    );

    setSuccessMessage("Feedback updated successfully.");
    return true;
  }

  async function deleteFeedbackById(feedbackId: number) {
    setError("");
    setSuccessMessage("");

    const { error } = await deleteFeedbackByIdService(feedbackId);

    if (error) {
      setError(error.message || "Failed to delete feedback.");
      return false;
    }

    setFeedbacks((prev) => prev.filter((item) => item.id !== feedbackId));
    setSuccessMessage("Feedback deleted successfully.");
    return true;
  }

  useEffect(() => {
    loadEventFeedbacks(eventId);
  }, [eventId]);

  return {
    feedbacks,
    loading,
    error,
    successMessage,
    addFeedback,
    editFeedbackById,
    deleteFeedbackById,
    loadEventFeedbacks,
  };
}