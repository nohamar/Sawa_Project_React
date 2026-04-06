import { useState, useEffect } from "react";
import type { Event, CreateEvent, UpdateEvent } from "../../types/events";
import { getEventStatus } from "../../utils/eventStatus";

type EventFormProps = {
  initialData?: Event;
  onSubmit: (data: CreateEvent | UpdateEvent) => Promise<boolean>;
  isEdit?: boolean;
  error?: string;
  successMessage?: string;
  userId?: number;
};

type EventFormData = {
  title: string;
  description: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  duration: string;
  capacity: string;
  type: string;
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

  // Fill form in edit mode
  useEffect(() => {
    if (initialData) {
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
      });
      setLocalError("");
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  function updateField<K extends keyof EventFormData>(
    key: K,
    value: EventFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.event_date ||
      !form.start_time ||
      !form.end_time ||
      !form.capacity ||
      Number(form.capacity) <= 0 ||
      !form.type.trim()
    ) {
      setLocalError("Please fill all required fields correctly.");
      return false;
    }

    setLocalError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (!isEdit && !userId) {
      setLocalError("User not authenticated.");
      return;
    }

    // ✅ auto-calculate status
    const status = getEventStatus(
      form.event_date,
      form.end_time,
      Number(form.capacity)
    );

    const data: any = {
      ...form,
      status,
      capacity: Number(form.capacity),
      duration: form.duration ? Number(form.duration) : null,
    };

    if (!isEdit && userId) {
      data.organizer_id = userId;
    }

    try {
      const success = await onSubmit(data);
      if (!success) {
        setLocalError("Failed to submit event.");
      } else {
        setForm(initialForm);
      }
    } catch (err: any) {
      setLocalError(err?.message || "Something went wrong.");
    }
  }

  const previewStatus = getEventStatus(
    form.event_date,
    form.end_time,
    Number(form.capacity)
  );

  return (
    <div className="form-card">
      <h2 style={{ marginBottom: "1rem" }}>
        {isEdit ? "Edit Event" : "Create Event"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={form.event_date}
            onChange={(e) => updateField("event_date", e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Start Time</label>
            <input
              type="time"
              value={form.start_time}
              onChange={(e) => updateField("start_time", e.target.value)}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>End Time</label>
            <input
              type="time"
              value={form.end_time}
              onChange={(e) => updateField("end_time", e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Capacity</label>
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => updateField("capacity", e.target.value)}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Duration (minutes)</label>
            <input
              type="number"
              min="0"
              value={form.duration}
              onChange={(e) => updateField("duration", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Type</label>
          <input
            type="text"
            value={form.type}
            onChange={(e) => updateField("type", e.target.value)}
          />
        </div>

        
        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
          Status: {previewStatus}
        </p>

        {localError && <p className="error-msg">{localError}</p>}
        {error && <p className="error-msg">{error}</p>}
        {successMessage && <p className="success-msg">{successMessage}</p>}

        <div style={{ marginTop: "1rem" }}>
          <button type="submit">
            {isEdit ? "Save Changes" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}