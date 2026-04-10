import "./Loader.css";

type LoaderProps = {
  text?: string;
  fullScreen?: boolean;
};

const Loader = ({
  text = "Loading your experience...",
  fullScreen = true,
}: LoaderProps) => {
  return (
    <div className={`loader-container ${fullScreen ? "full-screen" : ""}`}>
      <div className="loader-content">
        <div className="morph-visual">
          <div className="abstract-shape"></div>
          <div className="glass-core"></div>
        </div>
        <div className="text-section">
          <h3 className="brand-name">Sawa</h3>
          <div className="status-container">
            <p className="status-text">{text}</p>
            <span className="shimmer-bar"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;