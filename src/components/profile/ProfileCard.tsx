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
      ? styles["profile-card-sm"]
      : size === "lg"
      ? styles["profile-card-lg"]
      : styles["profile-card-md"];

  const variantClass =
    variant === "feedback" ? styles["feedback-variant"] : styles["default-variant"];

  return (
    <div className={`${styles["profile-card-mini"]} ${sizeClass} ${variantClass}`}>
      <div className={styles["profile-card-avatar"]}>
        {avatar ? (
          <img src={avatar} alt={fullName} />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      <div className={styles["profile-card-info"]}>
        <h4>{fullName}</h4>
        {email && <p>{email}</p>}
        {role && <span className={styles["profile-card-role"]}>{role}</span>}
      </div>
    </div>
  );
}

export default ProfileCard;