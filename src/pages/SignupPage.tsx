import { useState } from "react";
import { Link } from "react-router-dom";
import "../AuthPages.css";
import signupImage from "../assets/Volunteer T-Shirt_ Back Print, Charity Event Staff Uniform.jfif";
import { useAuth } from "../hooks/useAuth";

function SignupPage() {
  const { signUp } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !firstName.trim() ||
      !secondName.trim() ||
      !email.trim() ||
      !role.trim() ||
      !age.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const numericAge = Number(age);

    if (Number.isNaN(numericAge)) {
      setErrorMessage("Age must be a valid number.");
      return;
    }

    if (numericAge < 14) {
      setErrorMessage("You must be at least 14 years old to create an account.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const result = await signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          second_name: secondName,
          role: role as "volunteer" | "organizer",
          age,
          bio: bio.trim() ? bio : null,
        },
      },
    });

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    setSuccessMessage(
      "Account created successfully. Please check your email to verify your account before logging in."
    );

    setFirstName("");
    setSecondName("");
    setEmail("");
    setRole("");
    setAge("");
    setBio("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div
          className="auth-visual auth-visual-left"
          style={{ backgroundImage: `url(${signupImage})` }}
        >
          <div className="auth-visual-overlay" />

          <div className="auth-visual-content">
            <div className="auth-badge">Join the movement</div>

            <h1 className="auth-visual-title">
              Start your journey
              <br />
              as a volunteer
            </h1>

            <p className="auth-visual-text">
              Join a community committed to helping people in need through organized
              volunteer efforts and impactful events.
            </p>

            <div className="auth-steps">
              <div className="auth-step auth-step-active">
                <span className="auth-step-number">1</span>
                <p>Create your account</p>
              </div>

              <div className="auth-step">
                <span className="auth-step-number">2</span>
                <p>Choose your role</p>
              </div>

              <div className="auth-step">
                <span className="auth-step-number">3</span>
                <p>Join impactful events</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <Link to="/" className="auth-back-home">
            ← Back to Home
          </Link>

          <div className="auth-form-box">
            <h2 className="auth-form-title">Sign Up Account</h2>
            <p className="auth-form-subtitle">
              Enter your personal details to create your account.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-row">
                <div className="auth-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="eg. Rasha"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="auth-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="eg. Nasser"
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="eg. yourname@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-row">
                <div className="auth-field">
                  <label>Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    <option value="volunteer">Volunteer</option>
                    <option value="organizer">Organizer</option>
                  </select>
                </div>

                <div className="auth-field">
                  <label>Age</label>
                  <input
                    type="number"
                    min="14"
                    placeholder="eg. 18"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Bio (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="Tell us a little about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="auth-password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <small>Must be at least 8 characters.</small>
              </div>

              <div className="auth-field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {errorMessage && (
                <p className="auth-error-message">{errorMessage}</p>
              )}

              {successMessage && (
                <p className="auth-success-message">{successMessage}</p>
              )}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;