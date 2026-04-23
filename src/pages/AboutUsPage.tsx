import { useNavigate } from "react-router-dom";
import styles from "../css/AboutPage.module.css";

export default function AboutUsPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.aboutPage}>

      {/* ── Hero: Our Story ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroBlobPink}></div>
          <div className={styles.heroBlobGreen}></div>
        </div>

        <div className={styles.heroLeft}>
          <p className={styles.heroEyebrow}>✦ OUR STORY</p>
          <h1 className={styles.heroHeading}>
            We are{" "}
            <span className={styles.heroAccent}>three friends</span>{" "}
            building a kinder Lebanon, one volunteer at a time.
          </h1>
          <p className={styles.heroBody}>
            Sawa started as a conversation about how hard it was to find a
            place to help. It became a portal — and a quiet movement of
            people who refuse to wait.
          </p>
          <button className={styles.heroBtn} onClick={() => navigate("/events")}>
            Explore Events
          </button>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.heroImgBubble}>
            <img
              src="/images/aboutus-hero.jpg"
              alt="Sawa team"
              className={styles.heroImg}
            />
          </div>
          <div className={styles.heroStamp}>
            <svg viewBox="0 0 120 120" className={styles.stampSvg}>
              <defs>
                <path
                  id="aboutCircle"
                  d="M 60,60 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <text className={styles.stampText}>
                <textPath href="#aboutCircle" startOffset="0%">
                  MADE IN SAIDA · WITH CARE · MADE IN SAIDA · WITH CARE ·
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section className={styles.mission}>
        <div className={styles.missionInner}>
          <div className={styles.missionImgCol}>
            <img
              src="/images/our-mission.png"
              alt="Our mission illustration"
              className={styles.missionImg}
            />
          </div>
          <div className={styles.missionTextCol}>
            <p className={styles.sectionEyebrow}>✦ OUR MISSION</p>
            <h2 className={styles.missionHeading}>
              To make showing up{" "}
              <span className={styles.missionAccent}>effortless.</span>
            </h2>
            <p className={styles.missionBody}>
              We believe Lebanon is full of people who want to help — and
              organizers doing the hard, unseen work. Sawa is the bridge: a
              warm, simple place where intent meets opportunity.
            </p>
            <div className={styles.missionCards}>
              <div className={styles.missionCard}>
                <p className={styles.missionCardLabel}>For volunteers</p>
                <p className={styles.missionCardText}>
                  Find causes you care about, near you.
                </p>
              </div>
              <div className={styles.missionCard}>
                <p className={styles.missionCardLabel}>For organizers</p>
                <p className={styles.missionCardText}>
                  Reach the right people, faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className={styles.timeline}>
        <div className={styles.timelineInner}>
          <p className={styles.sectionEyebrow}>✦ THE JOURNEY</p>
          <h2 className={styles.timelineHeading}>
            A few years,{" "}
            <span className={styles.timelineAccent}>a lot of love.</span>
          </h2>

          <div className={styles.timelineTrack}>
            <div className={styles.timelineLine}></div>

            <div className={`${styles.timelineItem} ${styles.timelineLeft}`}>
              <div className={styles.timelineContent}>
                <p className={styles.timelineYear}>2023</p>
                <p className={styles.timelineText}>A late-night idea between three friends in Saida.</p>
              </div>
              <div className={styles.timelineDot}></div>
            </div>

            <div className={`${styles.timelineItem} ${styles.timelineRight}`}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <p className={styles.timelineYear}>2024</p>
                <p className={styles.timelineText}>First 50 volunteers join our quiet beta.</p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.timelineLeft}`}>
              <div className={styles.timelineContent}>
                <p className={styles.timelineYear}>2025</p>
                <p className={styles.timelineText}>Partnerships with 12 grassroots organizations across Lebanon.</p>
              </div>
              <div className={styles.timelineDot}></div>
            </div>

            <div className={`${styles.timelineItem} ${styles.timelineRight}`}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <p className={styles.timelineYear}>2026</p>
                <p className={styles.timelineText}>A nationwide portal — and just getting started.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className={styles.team}>
        <div className={styles.teamInner}>
          <p className={styles.sectionEyebrow}>✦ THE PEOPLE</p>
          <h2 className={styles.teamHeading}>Built with heart, in Lebanon.</h2>
          <div className={styles.teamGrid}>
            <div className={styles.memberCard}>
              <div className={styles.memberImgWrapper}>
                <img src="/images/Bissan.jpeg" alt="Bissan Al Miari" className={styles.memberImg} />
              </div>
              <p className={styles.memberName}>Bissan Al Miari</p>
              <p className={styles.memberRole}>Co-founder</p>
            </div>
            <div className={styles.memberCard}>
              <div className={styles.memberImgWrapper}>
                <img src="/images/Rasha.jpeg" alt="Rasha Abd AlLatif" className={styles.memberImg} />
              </div>
              <p className={styles.memberName}>Rasha Abd AlLatif</p>
              <p className={styles.memberRole}>Co-founder</p>
            </div>
            <div className={styles.memberCard}>
              <div className={styles.memberImgWrapper}>
                <img src="/images/Noha.jpeg" alt="Noha Mardini" className={styles.memberImg} />
              </div>
              <p className={styles.memberName}>Noha Mardini</p>
              <p className={styles.memberRole}>Co-founder</p>
              
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}