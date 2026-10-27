import { profile } from "../profile";
import { SectionHead, Spotlight } from "../components/ui";
import { sectionNumber } from "../lib/site";

export function Education() {
  if (!profile.education.length) return null;
  return (
    <section id="education" className="section">
      <SectionHead index={sectionNumber("education")} eyebrow="Education" title={<>Where I'm <span className="grad">learning</span></>} />
      <div className="edu">
        {profile.education.map((e) => (
          <Spotlight key={e.title} className="edu-card">
            <div className="edu-top">
              <span className="edu-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10 12 5 2 10l10 5 10-5ZM6 12v5c3 2 9 2 12 0v-5" />
                </svg>
              </span>
              <span className="badge badge-soft">{e.period}</span>
            </div>
            <h3>{e.title}</h3>
            <span className="where">{e.place}</span>
            {e.details ? <p>{e.details}</p> : null}
            {e.tags?.length ? (
              <>
                <span className="mono">Coursework</span>
                <div className="chips">
                  {e.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </>
            ) : null}
          </Spotlight>
        ))}
      </div>
    </section>
  );
}
