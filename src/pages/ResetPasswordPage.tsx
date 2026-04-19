import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/AuthPages.module.css";
import { authService } from "../services/authService";

function ResetPasswordPage() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const result = await authService.updatePassword(newPassword);

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    setSuccessMessage("Password updated successfully. Redirecting to login...");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);
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

        <h2 className={styles["auth-form-title"]}>Reset Password</h2>
        <p className={styles["auth-form-subtitle"]}>
          Enter your new password below.
        </p>

        <form className={styles["auth-form"]} onSubmit={handleSubmit}>
          <div className={styles["auth-field"]}>
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className={styles["auth-field"]}>
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;