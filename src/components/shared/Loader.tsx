import "../../Loader.css";
import styles from "../../css/Loader.module.css";

type LoaderProps = {
  text?: string;
  fullScreen?: boolean;
};

const Loader = ({
  text = "Loading your experience...",
  fullScreen = true,
}: LoaderProps) => {
  return (
    <div
      className={`${styles.loaderContainer} ${
        fullScreen ? styles.fullScreen : ""
      }`}
    >
      <div className={styles.loaderContent}>
        <div className={styles.morphVisual}>
          <div className={styles.abstractShape}></div>
          <div className={styles.glassCore}></div>
        </div>
        <div className={styles.textSection}>
          <h3 className={styles.brandName}>Sawa</h3>
          <div className={styles.statusContainer}>
            <p className={styles.statusText}>{text}</p>
            <span className={styles.shimmerBar}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;