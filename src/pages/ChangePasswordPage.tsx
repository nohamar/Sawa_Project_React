import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/AuthPages.module.css";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!user?.email) {
      setErrorMessage("No logged-in user found.");
      return;
    }

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage("New password must be different from the current password.");
      return;
    }

    setIsSubmitting(true);

    const result = await authService.changePassword(
      currentPassword,
      newPassword,
      user.email
    );

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    setSuccessMessage("Password changed successfully. Redirecting...");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      navigate("/profile", { replace: true });
    }, 1500);
  };

  return (
    <div className={`${styles["auth-page"]} ${styles["auth-simple-page"]}`}>
      <div className={styles["auth-simple-card"]}>
        <Link
          to="/profile"
          className={`${styles["auth-back-home"]} ${styles["auth-back-inline"]}`}
        >
          ← Back to Profile
        </Link>

        <h2 className={styles["auth-form-title"]}>Change Password</h2>
        <p className={styles["auth-form-subtitle"]}>
          Enter your current password, then choose a new one.
        </p>

        <form className={styles["auth-form"]} onSubmit={handleSubmit}>
          <div className={styles["auth-field"]}>
            <label>Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

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
            <label>Confirm New Password</label>
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
            {isSubmitting ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;