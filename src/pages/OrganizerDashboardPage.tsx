import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useRegister } from "../hooks/useRegister";
import styles from "../css/OrganizerDashboard.module.css";

type Props = {
  currentUserId?: number;
};

// The usable bar area height in px — must match `.barChart` height minus label space
const BAR_AREA_PX = 130;

export default function OrganizerDashboard({ currentUserId }: Props) {
  const { events, loading, loadEventsByOrganizer } = useEvents();
  const { allRegistrations, loadAllRegistrations } = useRegister(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserId) {
      loadEventsByOrganizer(currentUserId);
      loadAllRegistrations();
    }
  }, [currentUserId]);

  const organizerEvents = events ?? [];

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const upcomingEvents = organizerEvents.filter((e) => {
    const d = new Date(e.event_date);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  });

  const completedEvents = organizerEvents.filter((e) => {
    const d = new Date(e.event_date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  });

  const organizerEventIds = useMemo(
    () => organizerEvents.map((e) => String(e.id)),
    [organizerEvents]
  );

  const confirmedRegistrations = useMemo(() => {
    return (allRegistrations ?? []).filter(
      (r) =>
        r.registration_status === "confirmed" &&
        organizerEventIds.includes(String(r.event_id))
    ).length;
  }, [allRegistrations, organizerEventIds]);

  const recentUpcoming = upcomingEvents.slice(0, 3);

  // ── Bar chart: last 6 months ──
  const now = new Date();

  const monthRefs = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      month: d.getMonth(),
      year: d.getFullYear(),
      label: d.toLocaleString("default", { month: "short" }),
    };
  }).reverse();

  const eventsPerMonth = monthRefs.map((m) =>
    organizerEvents.filter((ev) => {
      const d = new Date(ev.event_date);
      return d.getMonth() === m.month && d.getFullYear() === m.year;
    }).length
  );

  const maxEvents = Math.max(...eventsPerMonth, 1);

  // ✅ Pixel heights — percentage-based heights don't work in flex containers
  const barPxHeights = eventsPerMonth.map((count) =>
    count === 0 ? 0 : Math.max((count / maxEvents) * BAR_AREA_PX, 6)
  );

  // ── Donut chart: event types ──
  const TYPE_COLORS: Record<string, string> = {
    Workshop: "var(--accent-primary)",
    Seminar:  "var(--accent-secondary)",
    Volunteer:"var(--accent-teal)",
    Social:   "var(--accent-green)",
    Charity:  "#c4a882",
  };

  const typeCounts: Record<string, number> = {
    Workshop: 0, Seminar: 0, Volunteer: 0, Social: 0, Charity: 0,
  };

  organizerEvents.forEach((e) => {
    if (typeCounts[e.type] !== undefined) typeCounts[e.type]++;
  });

  const totalTypes = Object.values(typeCounts).reduce((a, b) => a + b, 0);

  const typePercentages = Object.entries(typeCounts).map(([type, count]) => ({
    type,
    percent: totalTypes ? (count / totalTypes) * 100 : 0,
    color: TYPE_COLORS[type] ?? "#ccc",
  }));

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        <h2 className={styles.title}>Organizer Dashboard</h2>

        {/* STATS */}
        <div className={styles.stats}>
          <div className={styles.card}>
            <h3>{organizerEvents.length}</h3>
            <p>Total Events</p>
          </div>
          <div className={styles.card}>
            <h3>{confirmedRegistrations}</h3>
            <p>Confirmed Registrations</p>
          </div>
          <div className={styles.card}>
            <h3>{completedEvents.length}</h3>
            <p>Completed Events</p>
          </div>
          <div className={styles.card}>
            <h3>{upcomingEvents.length}</h3>
            <p>Upcoming Events</p>
          </div>
        </div>

        {/* GRAPHS */}
        <div className={styles.gridRow}>

          {/* BAR CHART */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Events per Month</h3>
            </div>

            <div className={styles.barChart}>
              {barPxHeights.map((px, i) => (
                <div key={i} className={styles.barGroup}>
                  {/* ✅ height in px — renders correctly inside flex */}
                  <div
                    className={styles.bar}
                    style={{ height: `${px}px` }}
                  />
                  <span className={styles.barLabel}>
                    {monthRefs[i].label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DONUT CHART */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Event Types</h3>
            </div>

            <div className={styles.donutWrap}>
              <svg
                width="140"
                height="140"
                viewBox="0 0 36 36"
                className={styles.donutSvg}
              >
                {/* background track */}
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="transparent"
                  stroke="var(--border-soft)"
                  strokeWidth="3.5"
                />

                {typePercentages.map((t, i) => {
                  const offset = typePercentages
                    .slice(0, i)
                    .reduce((acc, cur) => acc + cur.percent, 0);

                  if (t.percent === 0) return null;

                  return (
                    <circle
                      key={t.type}
                      cx="18" cy="18" r="15.915"
                      fill="transparent"
                      stroke={t.color}
                      strokeWidth="3.5"
                      strokeDasharray={`${t.percent} ${100 - t.percent}`}
                      strokeDashoffset={`${-offset}`}
                      style={{ transition: "stroke-dasharray 0.6s ease" }}
                    />
                  );
                })}
              </svg>

              <div className={styles.donutLegend}>
                {typePercentages.map((t) => (
                  <div key={t.type} className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ background: t.color }}
                    />
                    <span className={styles.legendLabel}>{t.type}</span>
                    <span className={styles.legendVal}>
                      {t.percent.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RECENT EVENTS */}
        <div className={styles.recentSection}>
          <div className={styles.recentHeader}>
            <h3>Upcoming Events</h3>
            <button onClick={() => navigate("/organizer-dashboard/events")}>
              Browse All
            </button>
          </div>

          <div className={styles.events}>
            {recentUpcoming.length === 0 ? (
              <p>No upcoming events</p>
            ) : (
              recentUpcoming.map((event) => (
                <div key={event.id} className={styles.eventCard}>
                  <img
                    src={event.image || "/default-event.jpg"}
                    alt={event.title}
                    className={styles.eventImage}
                  />
                  <div className={styles.eventInfo}>
                    <h4>{event.title}</h4>
                    <p>{new Date(event.event_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.addSection}>
          <h3>Create a New Event</h3>
          <p>
            Ready to organize something amazing? Add a new event and
            start attracting participants.
          </p>
          <button onClick={() => navigate("/organizer-dashboard/create-event")}>
            + Add Event
          </button>
        </div>
      </div>
    </div>
  );
}