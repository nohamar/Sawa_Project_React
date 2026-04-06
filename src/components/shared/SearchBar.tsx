import styles from "../../css/EventList.module.css";

type SearchBarProps = {
  keyword: string;
  onKeywordChange: (value: string) => void;
};

export default function SearchBar({ keyword, onKeywordChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search by title..."
      value={keyword}
      onChange={(e) => onKeywordChange(e.target.value)}
      className={styles.searchInput}
    />
  );
}