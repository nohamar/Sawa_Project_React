import { useEffect, useMemo, useState } from "react";
import {
  deleteFeedbackById,
  getFeedbackUser,
  updateFeedback,
} from "../services/feedbackService";
import type { FeedbackWithEventAndProfile } from "../types/feedback";

export function useMyFeedbacks(volunteerId: number | null) {
  const [feedbacks, setFeedbacks] = useState<FeedbackWithEventAndProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadMyFeedbacks(
    currentVolunteerId: number | null = volunteerId
  ) {
    if (!currentVolunteerId) {
      setFeedbacks([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await getFeedbackUser(currentVolunteerId);

      if (error) {
        setError(error.message);
        return;
      }

      setFeedbacks((data as FeedbackWithEventAndProfile[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function removeMyFeedback(feedbackId: number) {
    clearMessages();

    const { error } = await deleteFeedbackById(feedbackId);

    if (error) {
      setError(error.message || "Failed to delete feedback.");
      return false;
    }

    setFeedbacks((prev) => prev.filter((item) => item.id !== feedbackId));
    setSuccessMessage("Feedback deleted successfully.");
    return true;
  }

  async function editMyFeedback(
    feedbackId: number,
    comment: string,
    rating: number
  ) {
    clearMessages();

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

  function clearMessages() {
    setError("");
    setSuccessMessage("");
  }

  const recentFeedbacks = useMemo(() => feedbacks.slice(0, 3), [feedbacks]);

  useEffect(() => {
    loadMyFeedbacks(volunteerId);
  }, [volunteerId]);

  return {
    feedbacks,
    recentFeedbacks,
    loading,
    error,
    successMessage,
    loadMyFeedbacks,
    removeMyFeedback,
    editMyFeedback,
  };
}