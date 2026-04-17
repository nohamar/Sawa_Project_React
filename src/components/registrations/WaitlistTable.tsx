import type { RegistrationWithVolunteer } from "../../types/registration";
import WaitlistRow from "./WaitlistRow";
import styles from "../../css/ParticipantsTable.module.css";

type Props = {
  items: RegistrationWithVolunteer[];
};

export default function WaitlistTable({ items }: Props) {
  return (
    <div className={styles.tableCard}>
      <h3 className={styles.title}>Waitlist</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Volunteer</th>
            <th>Position</th>
            <th>Registered At</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <WaitlistRow key={item.id} registration={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}