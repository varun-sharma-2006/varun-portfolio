import { profile, projects } from "../profile";

const SITE = "varunsharma.vercel.app";
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * A one-page resume built from profile.ts. Hidden on screen; when the page is printed (or saved as PDF),
 * it is the only thing that prints, so the printout never goes out of date.
 */
export function PrintResume() {
  return (
    <div className="print-resume" aria-hidden="true">
      <header>
        <div>
          <h1>{profile.name}</h1>
          <p>
            {profile.role} · B.Tech CSE (AI), Class of {profile.graduation} · {profile.location}
          </p>
        </div>
        <ul className="pr-contact">
          <li>{profile.email}</li>
          <li>{bare(profile.github)}</li>
          <li>{bare(profile.linkedin)}</li>
          <li>{SITE}</li>
        </ul>
      </header>

      <p className="pr-summary">
        {profile.intro} {profile.lookingFor}.
      </p>

      <h2>Projects</h2>
      {projects.map((p) => (
        <div key={p.id} className="pr-item">
          <div className="pr-row">
            <strong>
              {p.name}
              {p.event ? <em> · {p.event}</em> : null}
            </strong>
            <span>{bare(p.links[0]?.href ?? "")}</span>
          </div>
          <p>
            {p.tagline} {p.highlight}
          </p>
          <p className="pr-stack">{p.stack.slice(0, 8).join(" · ")}</p>
        </div>
      ))}

      <h2>Education</h2>
      {profile.education.map((e) => (
        <div key={e.title} className="pr-item">
          <div className="pr-row">
            <strong>{e.title}</strong>
            <span>{e.period}</span>
          </div>
          <p>
            {e.place}
            {e.tags?.length ? ` · ${e.tags.join(", ")}` : ""}
          </p>
        </div>
      ))}

      <h2>Skills</h2>
      <dl className="pr-skills">
        {profile.skills.map((g) => (
          <div key={g.group}>
            <dt>{g.group}</dt>
            <dd>{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>

      <div className="pr-two">
        <div>
          <h2>Experience</h2>
          {profile.experience.map((e) => (
            <p key={e.title + e.place}>
              <strong>{e.title}</strong>, {e.place} ({e.period})
            </p>
          ))}
        </div>
        <div>
          <h2>Certifications</h2>
          <p>{profile.certifications.map((c) => `${c.name}${c.issuer && c.issuer !== c.platform ? ` (${c.issuer})` : ` (${c.platform})`}`).join("; ")}</p>
        </div>
      </div>
    </div>
  );
}
