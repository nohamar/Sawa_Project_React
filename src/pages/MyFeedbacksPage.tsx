import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMyFeedbacks } from "../hooks/useMyFeedback";
import type {
  FeedbackWithEventAndProfile,
} from "../types/feedback";
import type { FeedbackCardAction } from "../components/feedback/FeedbackCard";

import { FeedbackCard } from "../components/feedback/FeedbackCard";
import ProfileCard from "../components/profile/ProfileCard";
import ConfirmationDialog from "../components/shared/ConfirmationDialog";
import SearchBar from "../components/shared/SearchBar";
import Loader from "../components/shared/Loader";

import type { Profile } from "../types/profile";

import pageStyles from "../css/EventList.module.css";
import feedbackStyles from "../css/FeedbackCard.module.css";

type MyFeedbacksPageProps = {
  id: number | null;
  profile: Profile | null;
};

export default function MyFeedbacksPage({
  id,
  profile,
}: MyFeedbacksPageProps) {
  const navigate = useNavigate();

  const {
    feedbacks,
    loading,
    error,
    successMessage,
    removeMyFeedback,
  } = useMyFeedbacks(id);

  const [keyword, setKeyword] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  function getEventTitle(feedback: FeedbackWithEventAndProfile) {
    return feedback.Events?.title ?? "Unknown Event";
  }

function handleAskDelete(feedbackId: number) {
  setPendingDeleteId(feedbackId);
  setIsDialogOpen(true);
}

async function handleConfirmDelete() {
  if (pendingDeleteId === null) return;

  await removeMyFeedback(pendingDeleteId);
  setIsDialogOpen(false);
  setPendingDeleteId(null);
}

function handleCancelDelete() {
  setIsDialogOpen(false);
  setPendingDeleteId(null);
}

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      const title = getEventTitle(feedback).toLowerCase();

      const matchesKeyword =
        !keyword || title.includes(keyword.toLowerCase());

      const matchesRating =
        !ratingFilter || feedback.rating === Number(ratingFilter);

      return matchesKeyword && matchesRating;
    });
  }, [feedbacks, keyword, ratingFilter]);

  function getActions(
    feedback: FeedbackWithEventAndProfile
  ): FeedbackCardAction[] {
    return [
      {
        label: "Edit",
        onClick: () =>
          navigate(`/events/${feedback.event_id}`, {
            state: {
              openReviewForm: true,
              editFeedbackId: feedback.id,
              initialComment: feedback.comment,
              initialRating: feedback.rating,
            },
          }),
        className: `${feedbackStyles.btn} ${feedbackStyles.btnEdit}`,
      },
      {
  label: "Delete",
  onClick: () => handleAskDelete(feedback.id),
  className: `${feedbackStyles.btn} ${feedbackStyles.btnDelete}`,
}
    ];
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <p className={pageStyles.noEvents} style={{ color: "red" }}>
        {error}
      </p>
    );
  }

  return (
    <div className={pageStyles.eventsPage}>
      <h2 className={pageStyles.eventsHeading}>My Feedbacks</h2>

      {successMessage && <p>{successMessage}</p>}

      <div className={pageStyles.filter}>
        <SearchBar keyword={keyword} onKeywordChange={setKeyword} />

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className={pageStyles.select}
        >
          <option value="">All Ratings</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <p className={pageStyles.noEvents}>No feedback matches your search.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredFeedbacks.map((feedback) => {
            const author = feedback.profile;

            return (
              <div key={feedback.id}>
                <h3
                  style={{
                    marginBottom: "10px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#222",
                  }}
                >
                  {getEventTitle(feedback)}
                </h3>

                <FeedbackCard
                  feedback={feedback}
                  profileSection={
                    <ProfileCard
                      fullName={
                        author
                          ? `${author.first_name} ${author.second_name}`
                          : profile
                          ? `${profile.first_name} ${profile.second_name}`
                          : "User"
                      }
                      avatar={author?.avatar ?? profile?.avatar ?? null}
                      email={author?.email ?? profile?.email}
                      role={author?.role ?? profile?.role ?? "Volunteer"}
                      size="sm"
                      variant="feedback"
                    />
                  }
                  actions={getActions(feedback)}
                />
              </div>
            );
          })}
        </div>
      )}
<ConfirmationDialog
  isOpen={isDialogOpen}
  title="Delete Feedback"
  message="Are you sure you want to delete this feedback?"
  confirmText="Yes, delete"
  cancelText="Cancel"
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
/>
      
    </div>
  );
}