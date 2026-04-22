import type {
  AttendanceStatus,
  RegistrationWithVolunteer,
} from "../../types/registration";
import styles from "../../css/ParticipantsTable.module.css";
import ProfileCard from "../profile/ProfileCard";

type Props = {
  registration: RegistrationWithVolunteer;
  onAttendanceChange?: (
    registrationId: number,
    status: AttendanceStatus
  ) => void;
  showAttendanceControls?: boolean;
};

export default function ParticipantRow({
  registration,
  onAttendanceChange,
  showAttendanceControls = false,
}: Props) {
  const volunteer = registration.profile;

  const fullName = volunteer
    ? `${volunteer.first_name} ${volunteer.second_name}`
    : "Volunteer";

  return (
    <tr className={styles.row}>
      <td>
        <div className={styles.personCell}>
          <ProfileCard
            fullName={fullName}
            avatar={volunteer?.avatar ?? null}
            size="sm"
          />
        </div>
      </td>

      <td>
        {registration.registered_at
          ? new Date(registration.registered_at).toLocaleDateString()
          : "-"}
      </td>

      <td>{registration.registration_status}</td>

      <td>
        {showAttendanceControls && onAttendanceChange ? (
          <select
            className={styles.select}
            value={registration.attendance_status}
            onChange={(e) =>
              onAttendanceChange(
                registration.id,
                e.target.value as AttendanceStatus
              )
            }
          >
            <option value="pending">Pending</option>
            <option value="attended">Attended</option>
            <option value="absent">Absent</option>
          </select>
        ) : (
          <span>{registration.attendance_status}</span>
        )}
      </td>
    </tr>
  );
}