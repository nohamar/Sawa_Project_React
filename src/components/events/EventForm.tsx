import { useState, useEffect, useRef } from "react";
import type {
  Event,
  CreateEvent,
  UpdateEvent,
  EventFormData,
} from "../../types/events";
import { getEventStatus } from "../../utils/eventStatus";
import { uploadImage } from "../../services/storageService";
import styles from "../../css/EventForm.module.css";
import { useNavigate } from "react-router-dom";

type EventFormProps = {
  initialData: Event | null;
  onSubmit: (data: CreateEvent | UpdateEvent) => Promise<boolean>;
  isEdit?: boolean;
  error?: string;
  successMessage?: string;
  userId: number;
};

const initialForm: EventFormData = {
  title: "",
  description: "",
  location: "",
  event_date: "",
  start_time: "",
  end_time: "",
  duration: "",
  capacity: "",
  type: "",
  image: "",
};

export default function EventForm({
  initialData,
  onSubmit,
  isEdit = false,
  error,
  successMessage,
  userId,
}: EventFormProps) {
  const [form, setForm] = useState<EventFormData>(initialForm);
  const [localError, setLocalError] = useState("");
  const initialized = useRef(false);

  // 🔹 Load edit data
  useEffect(() => {
    if (initialData && !initialized.current) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        location: initialData.location || "",
        event_date: initialData.event_date || "",
        start_time: initialData.start_time || "",
        end_time: initialData.end_time || "",
        duration: initialData.duration?.toString() || "",
        capacity: initialData.capacity?.toString() || "",
        type: initialData.type || "",
        image: initialData.image || "",
      });

      initialized.current = true;
    }

    if (!initialData) {
      setForm(initialForm);
      initialized.current = false;
    }
  }, [initialData]);

  function updateField<K extends keyof EventFormData>(
    key: K,
    value: EventFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // 🔹 Upload image
  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadImage(userId, file);

    if (result.success && result.publicUrl) {
      updateField("image", result.publicUrl); 
      setLocalError("");
    } else {
      setLocalError("Failed to upload image");
    }
  }

  // 🔹 Validation
  function validate() {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.event_date ||
      !form.start_time ||
      !form.end_time ||
      !form.capacity ||
      !form.type ||
      !form.image
    ) {
      setLocalError("Please fill all required fields including image.");
      return false;
    }

    return true;
  }

  // 🔹 Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    const status = getEventStatus(
      form.event_date,
      form.end_time,
      Number(form.capacity)
    );

    const baseData = {
      title: form.title,
      description: form.description,
      location: form.location,
      event_date: form.event_date,
      start_time: form.start_time,
      end_time: form.end_time,
      capacity: Number(form.capacity),
      status,
      duration: Number(form.duration),
      type: form.type as any,
      image: form.image, 
    };

    const payload = isEdit
      ? (baseData as UpdateEvent)
      : ({ ...baseData, organizer_id: userId } as CreateEvent);

    const success = await onSubmit(payload);

    if (!success) {
      setLocalError("Failed to submit event.");
    } else {
      setForm(initialForm);
    }
  }
  const navigate = useNavigate();

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>
        {isEdit ? "Edit Event" : "Create Event"}
      </h2>

      <form onSubmit={handleSubmit}>
        
        <div className={styles.formGroup}>
          <label>Event Title</label>
          <input
            className={styles.input}
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        
        <div className={styles.formGroup}>
          <label>Upload Image *</label>
          <div
    className={styles.uploadBox}
    onClick={() => document.getElementById("fileInput")?.click()}
  >
    {form.image ? (
      <img
        src={form.image}
        alt="preview"
        className={styles.previewImage}
      />
    ) : (
      <p>Click to upload image</p>
    )}
  </div>

  <input
    id="fileInput"
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={handleImageUpload}
  />
</div>

        {/* DESCRIPTION */}
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            className={styles.textarea}
            value={form.description}
            onChange={(e) =>
              updateField("description", e.target.value)
            }
          />
        </div>

        {/* LOCATION */}
        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            className={styles.input}
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
          />
        </div>

        {/* DATE */}
        <div className={styles.formGroup}>
          <label>Date</label>
          <input
            type="date"
            className={styles.input}
            value={form.event_date}
            onChange={(e) =>
              updateField("event_date", e.target.value)
            }
          />
        </div>

        {/* TIME */}
        <div className={styles.formRow}>
          <input
            type="time"
            className={styles.input}
            value={form.start_time}
            onChange={(e) =>
              updateField("start_time", e.target.value)
            }
          />
          <input
            type="time"
            className={styles.input}
            value={form.end_time}
            onChange={(e) =>
              updateField("end_time", e.target.value)
            }
          />
        </div>

        {/* CAPACITY */}
        <div className={styles.formGroup}>
          <label>Capacity</label>
          <input
            type="number"
            className={styles.input}
            value={form.capacity}
            onChange={(e) =>
              updateField("capacity", e.target.value)
            }
          />
        </div>

        {/* DURATION */}
        <div className={styles.formGroup}>
          <label>Duration</label>
          <input
            type="number"
            className={styles.input}
            value={form.duration}
            onChange={(e) =>
              updateField("duration", e.target.value)
            }
          />
        </div>

        {/* TYPE */}
        <div className={styles.formGroup}>
          <label>Type</label>
          <select
            className={styles.select}
            value={form.type}
            onChange={(e) => updateField("type", e.target.value)}
          >
            <option value="">Select type</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Social">Social</option>
            <option value="Charity">Charity</option>
          </select>
        </div>

        {/* STATUS */}
        <div className={styles.statusRow}>
          Status:{" "}
          <span className={styles.statusBadge}>
            {getEventStatus(
              form.event_date,
              form.end_time,
              Number(form.capacity)
            )}
          </span>
        </div>

        {/* ERRORS */}
        {localError && <p className={styles.errorMsg}>{localError}</p>}
        {error && <p className={styles.errorMsg}>{error}</p>}
        {successMessage && (
          <p className={styles.successMsg}>{successMessage}</p>
        )}

        {/* SUBMIT */}
        <button type="submit" className={styles.submitBtn} onClick={()=>navigate("/organizer-dashboard/events")}>
          {isEdit ? "Save Changes" : "Create Event"}
        </button>
      </form>
    </div>
  );
}