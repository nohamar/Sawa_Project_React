import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../ProfilePage.css";
import { useAuth } from "../hooks/useAuth";
import { profileService } from "../services/profileService";

function ProfilePage() {
  const navigate = useNavigate();
  const { profile, user, refreshProfile } = useAuth();

  const profileRef = useRef<HTMLElement | null>(null);
  const accountInfoRef = useRef<HTMLElement | null>(null);
  const securityRef = useRef<HTMLElement | null>(null);

  const [activeSection, setActiveSection] = useState("profile");

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name ?? "");
      setSecondName(profile.second_name ?? "");
      setBio(profile.bio ?? "");
      setAge(profile.age ?? "");
      setAvatarPreview(profile.avatar ?? "");
    }
  }, [profile]);

  const initial = useMemo(() => {
    if (firstName.trim()) return firstName.charAt(0).toUpperCase();
    if (user?.email?.trim()) return user.email.charAt(0).toUpperCase();
    return "U";
  }, [firstName, user]);

  const fullName = `${firstName} ${secondName}`.trim();

  const websiteLink =
    profile?.role === "organizer" ? "/organizer-dashboard" : "/volunteer-dashboard";

  const completionFields = [
    Boolean(avatarPreview),
    Boolean(firstName.trim()),
    Boolean(secondName.trim()),
    Boolean((profile?.email || user?.email || "").trim()),
    Boolean(profile?.role?.trim()),
    Boolean(bio.trim()),
    Boolean(age.trim()),
  ];

  const completionPercent = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100
  );

  const missingItems = [
    !avatarPreview ? "Add a profile picture" : null,
    !bio.trim() ? "Add a short bio" : null,
    !age.trim() ? "Add your age" : null,
  ].filter(Boolean) as string[];

  const scrollToSection = (section: "profile" | "account" | "security") => {
    setActiveSection(section);

    if (section === "profile" && profileRef.current) {
      profileRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (section === "account" && accountInfoRef.current) {
      accountInfoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (section === "security" && securityRef.current) {
      securityRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!profile?.id) return;

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image must be under 10MB.");
      return;
    }

    setErrorMessage("");
    setSaveMessage("");

    const reader = new FileReader();

    reader.onloadend = async () => {
      const result = reader.result;
      if (typeof result !== "string") return;

      setIsSaving(true);

      const updateResult = await profileService.updateProfile(profile.id, {
        avatar: result,
      });

      setIsSaving(false);

      if (updateResult.error) {
        setErrorMessage(updateResult.error);
        return;
      }

      setAvatarPreview(result);
      setSaveMessage("Profile picture updated successfully.");
      await refreshProfile();
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    if (!profile?.id) return;

    setErrorMessage("");
    setSaveMessage("");
    setIsSaving(true);

    const updateResult = await profileService.updateProfile(profile.id, {
      avatar: null,
    });

    setIsSaving(false);

    if (updateResult.error) {
      setErrorMessage(updateResult.error);
      return;
    }

    setAvatarPreview("");
    setSaveMessage("Profile picture removed.");
    await refreshProfile();
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile?.id) return;

    setErrorMessage("");
    setSaveMessage("");

    if (!firstName.trim() || !secondName.trim()) {
      setErrorMessage("First name and last name are required.");
      return;
    }

    if (age.trim()) {
      const numericAge = Number(age);
      if (Number.isNaN(numericAge)) {
        setErrorMessage("Age must be a valid number.");
        return;
      }

      if (numericAge < 14) {
        setErrorMessage("Age cannot be less than 14.");
        return;
      }
    }

    setIsSaving(true);

    const updateResult = await profileService.updateProfile(profile.id, {
      first_name: firstName.trim(),
      second_name: secondName.trim(),
      bio: bio.trim() ? bio : null,
      age: age.trim() ? age : null,
    });

    setIsSaving(false);

    if (updateResult.error) {
      setErrorMessage(updateResult.error);
      return;
    }

    setSaveMessage("Profile updated successfully.");
    await refreshProfile();
  };

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <Link to={websiteLink} className="profile-back-link">
          ← Go Back to Website
        </Link>
      </div>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-sidebar-user">
            <div className="profile-sidebar-avatar">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile avatar" />
              ) : (
                <span>{initial}</span>
              )}
            </div>

            <div className="profile-sidebar-user-info">
              <h3>{fullName || "User Profile"}</h3>
              <p>{user?.email || "No email available"}</p>
            </div>
          </div>

          <div className="profile-progress-card">
            <div className="profile-progress-head">
              <span>Profile Completion</span>
              <strong>{completionPercent}%</strong>
            </div>

            <div className="profile-progress-bar">
              <div
                className="profile-progress-fill"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            {missingItems.length > 0 ? (
              <div className="profile-progress-tips">
                {missingItems.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            ) : (
              <div className="profile-progress-tips">
                <p>Your profile looks complete.</p>
              </div>
            )}
          </div>

          <div className="profile-sidebar-section">
            <p className="profile-sidebar-label">Your account</p>

            <button
              className={`profile-sidebar-link ${
                activeSection === "profile" ? "active" : ""
              }`}
              type="button"
              onClick={() => scrollToSection("profile")}
            >
              Profile
            </button>

            <button
              className={`profile-sidebar-link ${
                activeSection === "account" ? "active" : ""
              }`}
              type="button"
              onClick={() => scrollToSection("account")}
            >
              Account Info
            </button>

            <button
              className={`profile-sidebar-link ${
                activeSection === "security" ? "active" : ""
              }`}
              type="button"
              onClick={() => scrollToSection("security")}
            >
              Security
            </button>
          </div>
        </aside>

        <main className="profile-content">
          <section className="profile-card" ref={profileRef}>
            <div className="profile-card-header">
              <div>
                <h2>Profile Settings</h2>
                <p>Manage your personal information and profile picture.</p>
              </div>
            </div>

            <div className="profile-avatar-row">
              <div className="profile-avatar-preview">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile avatar" />
                ) : (
                  <span>{initial}</span>
                )}
              </div>

              <div className="profile-avatar-actions">
                <h3>Profile Picture</h3>

                <div className="profile-avatar-buttons">
                  <label className="profile-primary-btn profile-upload-label">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      hidden
                    />
                  </label>

                  <button
                    type="button"
                    className="profile-secondary-btn"
                    onClick={handleRemoveAvatar}
                  >
                    Remove
                  </button>
                </div>

                <p>Supported: PNG, JPG, JPEG under 10MB.</p>
              </div>
            </div>

            <form className="profile-form-grid" onSubmit={handleSaveProfile}>
              <div className="profile-field">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="profile-field">
                <label>Last Name</label>
                <input
                  type="text"
                  value={secondName}
                  onChange={(e) => setSecondName(e.target.value)}
                />
              </div>

              <div className="profile-field profile-field-full">
                <label>Bio (Optional)</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a little about yourself..."
                />
              </div>

              <div className="profile-field">
                <label>Age</label>
                <input
                  type="number"
                  min="14"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="eg. 18"
                />
              </div>

              <div className="profile-field profile-field-full">
                {errorMessage && (
                  <p className="profile-error-message">{errorMessage}</p>
                )}
                {saveMessage && (
                  <p className="profile-success-message">{saveMessage}</p>
                )}
              </div>

              <div className="profile-field profile-field-full">
                <button
                  type="submit"
                  className="profile-primary-btn profile-save-btn"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>

          <section className="profile-card" ref={accountInfoRef}>
            <div className="profile-card-header">
              <div>
                <h2>Account Info</h2>
                <p>Your account details linked to the platform.</p>
              </div>
            </div>

            <div className="profile-form-grid">
              <div className="profile-field profile-field-full">
                <label>Email</label>
                <input
                  type="email"
                  value={profile?.email || user?.email || ""}
                  readOnly
                />
              </div>

              <div className="profile-field">
                <label>Role</label>
                <input
                  type="text"
                  value={profile?.role ?? ""}
                  readOnly
                />
              </div>

              <div className="profile-field">
                <label>Joined</label>
                <input
                  type="text"
                  value={
                    profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : ""
                  }
                  readOnly
                />
              </div>
            </div>
          </section>

          <section className="profile-card" ref={securityRef}>
            <div className="profile-card-header profile-security-header">
              <div>
                <h2>Security</h2>
                <p>Update your password to keep your account secure.</p>
              </div>

              <button
                type="button"
                className="profile-primary-btn"
                onClick={() => navigate("/change-password")}
              >
                Change Password
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;