import type { RegistrationWithVolunteer } from "../../types/registration";
import styles from "../../css/ParticipantsTable.module.css";

type Props = {
  registration: RegistrationWithVolunteer;
};

export default function WaitlistRow({ registration }: Props) {
  const volunteer = registration.profiles?.[0];

const fullName = volunteer
  ? `${volunteer.first_name} ${volunteer.second_name}`
  : "Volunteer";

  return (
    <tr className={styles.row}>
      <td>
        <div className={styles.personCell}>
          <img
            src={volunteer?.avatar || "/images/default-avatar.png"}            alt={fullName}
            className={styles.avatar}
          />
          <span>{fullName}</span>
        </div>
      </td>
      <td>{registration.waitlist_position ?? "-"}</td>
      <td>{registration.registered_at ? new Date(registration.registered_at).toLocaleDateString() : "-"}</td>
    </tr>
  );
}