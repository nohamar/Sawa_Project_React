import type { ReactNode } from "react";
import type { Feedback } from "../../types/feedback";
import {
  FeedbackCard,
  type FeedbackCardAction,
} from "./FeedbackCard";
import styles from "../../css/FeedbackList.module.css";

type FeedbackListProps = {
  feedbacks: Feedback[];
  getActions?: (feedback: Feedback) => FeedbackCardAction[];
  renderProfileSection?: (feedback: Feedback) => ReactNode;
  onCardClick?: (feedback: Feedback) => void;
};

export default function FeedbackList({
  feedbacks,
  getActions,
  renderProfileSection,
  onCardClick,
}: FeedbackListProps) {
  if (!feedbacks.length) {
    return <p className={styles.emptyText}>No feedback available yet.</p>;
  }

  return (
    <div className={styles.list}>
      {feedbacks.map((feedback) => (
        <FeedbackCard
          key={feedback.id}
          feedback={feedback}
          profileSection={renderProfileSection?.(feedback)}
          actions={getActions ? getActions(feedback) : []}
          onClick={onCardClick ? () => onCardClick(feedback) : undefined}
        />
      ))}
    </div>
  );
}