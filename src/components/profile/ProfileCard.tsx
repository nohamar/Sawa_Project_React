import styles from "../../css/ProfileCard.module.css";

type ProfileCardProps = {
  fullName: string;
  avatar?: string | null;
  email?: string;
  role?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "feedback";
};

function ProfileCard({
  fullName,
  avatar,
  email,
  role,
  size = "md",
  variant = "default",
}: ProfileCardProps) {
  const initial = fullName?.trim()?.charAt(0)?.toUpperCase() || "U";

  const sizeClass =
    size === "sm"
      ? styles.profileCardSm
      : size === "lg"
      ? styles.profileCardLg
      : styles.profileCardMd;

  const variantClass =
    variant === "feedback" ? styles.feedbackVariant : styles.defaultVariant;

  return (
    <div className={`${styles.profileCardMini} ${sizeClass} ${variantClass}`}>
      <div className={styles.profileCardAvatar}>
        {avatar ? (
          <img src={avatar} alt={fullName} />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      <div className={styles.profileCardInfo}>
        <h4>{fullName}</h4>
        {email && <p>{email}</p>}
        {role && <span className={styles.profileCardRole}>{role}</span>}
      </div>
    </div>
  );
}

export default ProfileCard;