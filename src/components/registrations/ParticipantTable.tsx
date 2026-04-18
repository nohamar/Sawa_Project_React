import type {
  AttendanceStatus,
  RegistrationWithVolunteer,
} from "../../types/registration";
import ParticipantRow from "./ParticipantRow";
import styles from "../../css/ParticipantsTable.module.css";

type Props = {
  items: RegistrationWithVolunteer[];
  onAttendanceChange?: (
    registrationId: number,
    status: AttendanceStatus
  ) => void;
  showAttendanceControls?: boolean;
};

export default function ParticipantTable({
  items,
  onAttendanceChange,
  showAttendanceControls = false,
}: Props) {
  return (
    <div className={styles.tableCard}>
      <h3 className={styles.title}>Participants</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Volunteer</th>
            <th>Registered At</th>
            <th>Status</th>
            <th>Attendance</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <ParticipantRow
              key={item.id}
              registration={item}
              onAttendanceChange={onAttendanceChange}
              showAttendanceControls={showAttendanceControls}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}