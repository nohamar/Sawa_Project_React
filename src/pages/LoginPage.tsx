import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/AuthPages.module.css";
import loginImage from "../assets/Volunteer with FaithPrayers _ The FaithPrayers National Prayer Line.jfif";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, profile } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile?.role === "organizer") {
      navigate("/organizer-dashboard");
    } else if (profile?.role === "volunteer") {
      navigate("/volunteer-dashboard");
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    setIsSubmitting(true);

    const result = await signIn({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={`${styles["auth-shell"]} ${styles["auth-shell-login"]}`}>
        <div className={styles["auth-form-side"]}>
          <Link to="/" className={styles["auth-back-home"]}>
            ← Back to Home
          </Link>

          <div className={styles["auth-form-box"]}>
            <h2 className={styles["auth-form-title"]}>Welcome Back</h2>
            <p className={styles["auth-form-subtitle"]}>
              Log in to continue your volunteering journey and support
              meaningful community action.
            </p>

            <form className={styles["auth-form"]} onSubmit={handleSubmit}>
              <div className={styles["auth-field"]}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="eg. yourname@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles["auth-field"]}>
                <label>Password</label>
                <div className={styles["auth-password-wrap"]}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles["password-toggle"]}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className={styles["auth-form-options"]}>
                <label className={styles["remember-me"]}>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <Link to="/forgot-password" className={styles["forgot-link"]}>
                  Forgot Password?
                </Link>
              </div>

              {errorMessage && (
                <p className={styles["auth-error-message"]}>{errorMessage}</p>
              )}

              <button
                type="submit"
                className={styles["auth-submit-btn"]}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p className={styles["auth-switch-text"]}>
              Don’t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>

        <div
          className={`${styles["auth-visual"]} ${styles["auth-visual-right"]}`}
          style={{ backgroundImage: `url(${loginImage})` }}
        >
          <div className={styles["auth-visual-overlay"]} />

          <div className={styles["auth-visual-content"]}>
            <div className={styles["auth-badge"]}>Make every effort count</div>

            <h1 className={styles["auth-visual-title"]}>
              Show up.
              <br />
              Support others.
            </h1>

            <p className={styles["auth-visual-text"]}>
              Access volunteer opportunities, follow your registrations, and be
              part of the response that helps communities across Lebanon.
            </p>

            <div className={styles["auth-steps"]}>
              <div className={`${styles["auth-step"]} ${styles["auth-step-active"]}`}>
                <span className={styles["auth-step-number"]}>1</span>
                <p>Explore opportunities</p>
              </div>

              <div className={styles["auth-step"]}>
                <span className={styles["auth-step-number"]}>2</span>
                <p>Register for events</p>
              </div>

              <div className={styles["auth-step"]}>
                <span className={styles["auth-step-number"]}>3</span>
                <p>Create real impact</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;