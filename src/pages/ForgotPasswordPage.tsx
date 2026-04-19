import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../css/AuthPages.module.css";
import { authService } from "../services/authService";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    const result = await authService.sendPasswordResetEmail(email);

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    setSuccessMessage(
      "Password reset email sent. Please check your inbox."
    );
    setEmail("");
  };

  return (
    <div className={`${styles["auth-page"]} ${styles["auth-simple-page"]}`}>
      <div className={styles["auth-simple-card"]}>
        <Link
          to="/login"
          className={`${styles["auth-back-home"]} ${styles["auth-back-inline"]}`}
        >
          ← Back to Login
        </Link>

        <h2 className={styles["auth-form-title"]}>Forgot Password</h2>
        <p className={styles["auth-form-subtitle"]}>
          Enter your email and we’ll send you a link to reset your password.
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

          {errorMessage && (
            <p className={styles["auth-error-message"]}>{errorMessage}</p>
          )}

          {successMessage && (
            <p className={styles["auth-success-message"]}>{successMessage}</p>
          )}

          <button
            type="submit"
            className={styles["auth-submit-btn"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;