import type { ReactNode, MouseEvent } from "react";
import type { Feedback } from "../../types/feedback";
import ProfileCard from "../profile/ProfileCard";
import styles from "../../css/FeedbackCard.module.css";

export type FeedbackCardAction = {
  label: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  className?: string;
};

type FeedbackProfile = {
  fullName: string;
  avatar?: string | null;
  email?: string;
  role?: string;
};

type FeedbackCardProps = {
  feedback: Feedback;
  profile?: FeedbackProfile;
  profileSection?: ReactNode;
  actions?: FeedbackCardAction[];
  onClick?: () => void;
};

export const FeedbackCard = ({
  feedback,
  profile,
  profileSection,
  actions = [],
  onClick,
}: FeedbackCardProps) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.topSection}>
        <div className={styles.profileWrapper}>
          {profileSection ? (
            profileSection
          ) : (
            <ProfileCard
              fullName={profile?.fullName ?? "User"}
              avatar={profile?.avatar ?? null}
              email={profile?.email}
              role={profile?.role ?? "Volunteer"}
              size="sm"
              variant="feedback"
            />
          )}
        </div>

        <div className={styles.ratingBox}>
          <span className={styles.ratingLabel}>Rating</span>
          <span className={styles.ratingValue}>{feedback.rating}/5</span>
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.comment}>{feedback.comment}</p>
      </div>

      <div className={styles.footer}>
        <span className={styles.date}>
          {feedback.created_at
            ? new Date(feedback.created_at).toLocaleDateString()
            : ""}
        </span>

        <div className={styles.actions}>
          {actions.map((action, i) => (
            <button
              key={i}
              className={action.className || styles.btn}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(e);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};