import styles from "../../css/EventList.module.css";

type FilterBarProps = {
  status: string;
  type: string;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  eventTypes: string[];
};

export default function FilterBar({ status, type, onStatusChange, onTypeChange, eventTypes }: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <select value={status} onChange={(e) => onStatusChange(e.target.value)} className={styles.select}>
        <option value="">Select Status</option>
        <option value="upcoming">Upcoming</option>
        <option value="completed">Completed</option>
        <option value="closed">Closed</option>
      </select>

      <select value={type} onChange={(e) => onTypeChange(e.target.value)} className={styles.select}>
        <option value="">Select Type</option>
        {eventTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}