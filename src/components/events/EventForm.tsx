import { useState, useEffect, useRef } from "react";
import type { Event, CreateEvent, UpdateEvent, EventFormData, EventTypes } from "../../types/events";
import { getEventStatus } from "../../utils/eventStatus";
import { uploadImage } from "../../services/storageService";

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
  image:""
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

  // Fill form in edit mode
  useEffect(() => {
    if (initialData && !initialized.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setLocalError("");
    } else if (!initialData) {
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
      !form.type.trim() ||
      !form.image.trim()
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

    //  auto-calculate status
    const status = getEventStatus(
      form.event_date,
      form.end_time,
      Number(form.capacity)
    );

    try {
      if (isEdit) {
        const updateData: UpdateEvent = {
          title: form.title,
          description: form.description,
          location: form.location,
          event_date: form.event_date,
          start_time: form.start_time,
          end_time: form.end_time,
          capacity: Number(form.capacity),
          status,
          duration:  Number(form.duration),
          type: form.type as any, // Assuming type is valid
          image: form.image,
        };
        const success = await onSubmit(updateData);
        if (!success) {
          setLocalError("Failed to submit event.");
        } else {
          setForm(initialForm);
        }
      } else {
        const createData: CreateEvent = {
          organizer_id: userId,
          title: form.title,
          description: form.description,
          location: form.location,
          event_date: form.event_date,
          start_time: form.start_time,
          end_time: form.end_time,
          capacity: Number(form.capacity),
          status,
          duration:  Number(form.duration),
          type: form.type as any, 
          image: form.image,
        };
        const success = await onSubmit(createData);
        if (!success) {
          setLocalError("Failed to submit event.");
        } else {
          setForm(initialForm);
        }
      }
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const previewStatus = getEventStatus(
    form.event_date,
    form.end_time,
    Number(form.capacity)
  );

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  const result = await uploadImage(userId, file);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  updateField("image", result.publicUrl); 
}

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
          <label>Upload image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
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