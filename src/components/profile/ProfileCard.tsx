import "../../ProfileCard.css";

type ProfileCardProps = {
  fullName: string;
  avatar?: string | null;
  email?: string;
  role?: string;
  size?: "sm" | "md" | "lg";
};

function ProfileCard({
  fullName,
  avatar,
  email,
  role,
  size = "md",
}: ProfileCardProps) {
  const initial = fullName?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className={`profile-card-mini profile-card-${size}`}>
      <div className="profile-card-avatar">
        {avatar ? (
          <img src={avatar} alt={fullName} />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      <div className="profile-card-info">
        <h4>{fullName}</h4>
        {email && <p>{email}</p>}
        {role && <span className="profile-card-role">{role}</span>}
      </div>
    </div>
  );
}

export default ProfileCard;