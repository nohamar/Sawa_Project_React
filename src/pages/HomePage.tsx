import { useEvents } from "../hooks/useEvents";
import styles from "../css/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaCalendarCheck, FaPlusCircle, FaSearch } from "react-icons/fa";

const marqueeItems = [
  "Beach Cleanups",
  "Tree Planting",
  "Tutoring Kids",
  "Elderly Care",
  "Food Drives",
  "Technology Workshops",
  "Agricultural Events",
  "Shelter Building",
  "Clothing Donations",
  "Medical Outreach",
  "Animal Rescue",
  "Community Gardens",
  "Literacy Programs",
  "Youth Mentorship",
  "Clean Water Initiatives",
];

export default function HomePage() {
  const { events, loading, error, loadEvents } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const latestEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
    )
    .slice(0, 3);

  return (
    <div className={styles.homePage}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGlowLeft}></div>
          <div className={styles.heroGlowRight}></div>
          <div className={styles.heroBlurCenter}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.heroTag}>
              <span className={styles.heroTagDot}></span>
              LEBANON · COMMUNITY · TOGETHER
            </div>

            <h1 className={styles.heroHeading}>
              <span className={styles.heroLine}>Where</span>

              <span className={`${styles.heroLine} ${styles.heroAccentWrap}`}>
                <span className={styles.heroAccentText}>small acts</span>
                <svg
                  className={styles.heroUnderline}
                  viewBox="0 0 520 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6 26C89 11 157 8 255 15C347 22 414 24 514 11"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <span className={styles.heroLine}>grow into</span>

              <span className={`${styles.heroLine} ${styles.heroMovement}`}>
                a movement.
              </span>
            </h1>

            <p className={styles.heroBody}>
              Sawa is a portal for volunteers and organizers — discover
              meaningful events, share what you need, and turn a single
              afternoon into something a community remembers.
            </p>

            <div className={styles.heroCtas}>
              <button
                className={styles.heroBtnPrimary}
                onClick={() => navigate("/events")}
              >
                Explore Events
              </button>

              <button
                className={styles.heroBtnSecondary}
                onClick={() => navigate("/signup")}
              >
                Join the Circle
              </button>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroImageLayerBack}></div>

            <div className={styles.heroImageWrap}>
              <img
                src="/images/home-hero1.jpg"
                alt="Community volunteers working together"
                className={styles.heroImg}
              />
            </div>

            <div className={styles.heroBadge}>
              <span>made with care ✿</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee Strip ── */}
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              {item}
              <span className={styles.marqueeDot}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Volunteer Section ── */}
      <section className={styles.roleSection}>
        <div className={styles.roleSectionInner}>
          <div className={styles.roleText}>
            <h2 className={styles.roleTitle}>I am a Volunteer</h2>
            <div className={styles.roleDivider} data-color="green"></div>
            <ol className={styles.roleSteps}>
              <li>
                <span className={styles.roleStep} data-color="green">
                  1
                </span>
                Build your personal profile by adding your skills, interests and
                availability.
              </li>
              <li>
                <span className={styles.roleStep} data-color="green">
                  2
                </span>
                Browse and save events that match your interests.
              </li>
              <li>
                <span className={styles.roleStep} data-color="green">
                  3
                </span>
                Register for events and let organizers know you're ready to
                help.
              </li>
              <li>
                <span className={styles.roleStep} data-color="green">
                  4
                </span>
                Show up, make an impact, and grow your volunteer journey!
              </li>
            </ol>
            <div className={styles.roleCtas}>
              <button
                className={`${styles.roleBtn} ${styles.roleBtnPrimary}`}
                data-color="green"
                onClick={() => navigate("/signup")}
              >
                Join the Circle
              </button>
              <button
                className={`${styles.roleBtn} ${styles.roleBtnSecondary}`}
                onClick={() => navigate("/login")}
              >
                Already a Member
              </button>
            </div>
          </div>
          <div className={styles.roleImage}>
            <img src="/volunteer.svg" alt="Volunteer illustration" />
          </div>
        </div>
      </section>

      {/* ── Organizer Section ── */}
      <section className={`${styles.roleSection} ${styles.roleSectionAlt}`}>
        <div className={styles.roleSectionInner}>
          <div className={styles.roleImage}>
            <img src="/organizer.svg" alt="Organizer illustration" />
          </div>
          <div className={styles.roleText}>
            <h2 className={styles.roleTitle}>I am an Organizer</h2>
            <div className={styles.roleDivider} data-color="orange"></div>
            <ol className={styles.roleSteps}>
              <li>
                <span className={styles.roleStep} data-color="orange">
                  1
                </span>
                Create your organizer profile and represent your cause.
              </li>
              <li>
                <span className={styles.roleStep} data-color="orange">
                  2
                </span>
                Post volunteer events and describe what you need.
              </li>
              <li>
                <span className={styles.roleStep} data-color="orange">
                  3
                </span>
                Review registrations and manage your volunteers.
              </li>
              <li>
                <span className={styles.roleStep} data-color="orange">
                  4
                </span>
                Confirm participants and your event is ready to go!
              </li>
            </ol>
            <div className={styles.roleCtas}>
              <button
                className={`${styles.roleBtn} ${styles.roleBtnPrimary}`}
                data-color="orange"
                onClick={() => navigate("/signup")}
              >
                Set Up Your Organization
              </button>
              <button
                className={`${styles.roleBtn} ${styles.roleBtnSecondary}`}
                onClick={() => navigate("/login")}
              >
                Already a Member
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── What You Can Do ── */}
      <section className={styles.intro}>
        <div className={styles.introHeader}>
          <p className={styles.introEyebrow}>WHAT YOU CAN DO</p>
          <h2 className={styles.introHeading}>
            Three doors,{" "}
            <span className={styles.introHeadingAccent}>one circle.</span>
          </h2>
          <p className={styles.introSub}>
            Whether you have an hour or an organization behind you — there's a
            way in. Pick the one that feels like yours today.
          </p>
        </div>

        <div className={styles.userdo}>
          <div className={`${styles.card} ${styles.cardBrowse}`}>
            <div className={styles.cardTop}>
              <span className={styles.cardNum}>01</span>
              <FaSearch className={styles.icon} />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Browse</h3>
              <p>
                Discover events and find what's happening right around you, this
                week.
              </p>
            </div>
          </div>

          <div className={`${styles.card} ${styles.cardCreate}`}>
            <div className={styles.cardTop}>
              <span className={styles.cardNum}>02</span>
              <FaPlusCircle className={styles.icon} />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Create</h3>
              <p>
                Post your own event, describe what you need, and rally your
                community.
              </p>
            </div>
          </div>

          <div className={`${styles.card} ${styles.cardJoin}`}>
            <div className={styles.cardTop}>
              <span className={styles.cardNum}>03</span>
              <FaCalendarCheck className={styles.icon} />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Join</h3>
              <p>
                Register, show up, and become part of stories that ripple
                outward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent Events ── */}
      <section className={styles.featuredEvents}>
        <h2>Recent Events</h2>
        {loading && <p>Loading events...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className={styles.eventList}>
          {latestEvents.map((event) => (
            <div
              key={event.id}
              className={styles.eventCard}
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <div className={styles.eventContent}>
                <img src={event.image || ""} alt={event.title} />
                <h3>{event.title}</h3>
                <p className={styles.eventDate}>{event.event_date}</p>
                <p>{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <h2>Join an Event Today!</h2>
        <p>
          Be part of something amazing. Sign up and participate in upcoming
          events.
        </p>
        <button onClick={() => navigate("/events")}>Explore Events</button>
      </section>
    </div>
  );
}