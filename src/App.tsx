import { useEffect, useState } from "react";
import { profile, type Project, type TimelineItem } from "./profile";

const [firstName, ...rest] = profile.name.split(" ");
const lastName = rest.join(" ");

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`arrow ${className}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function Seal({ size = 40 }: { size?: number }) {
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  return (
    <svg className="seal" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <text x="24" y="29.5" textAnchor="middle" fontFamily="Fraunces Variable, Georgia, serif" fontStyle="italic" fontSize="15" fill="currentColor">
        {initials}
      </text>
    </svg>
  );
}

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useLocalTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return time.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <div className="section-label" data-reveal>
      <span className="index">({index})</span>
      <span>{children}</span>
      <i />
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-links">
      {project.links.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="text-link">
          {link.label}
          <Arrow />
        </a>
      ))}
    </div>
  );
}

function Featured({ project }: { project: Project }) {
  return (
    <article className="featured" data-reveal>
      <div className="featured-meta">
        <span className="index">01</span>
        <span className="kicker">Featured</span>
      </div>
      <div className="featured-body">
        <h3>{project.name}</h3>
        <p className="lede">{project.tagline}.</p>
        {project.image ? (
          <a className="plate" href={project.links[0]?.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`}>
            <img src={project.image} alt={`${project.name} interface`} loading="lazy" />
            <span className="plate-caption">
              Fig. 1 — Portfolio view, live on real market data <Arrow />
            </span>
          </a>
        ) : null}
        <div className="featured-columns">
          <p className="body">{project.description}</p>
          <ul className="points">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <div className="featured-foot">
          <p className="stack">{project.tech.join(" · ")}</p>
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <article className="row" data-reveal>
      <span className="index">{String(index + 2).padStart(2, "0")}</span>
      <div className="row-title">
        <h3>{project.name}</h3>
        <p className="lede">{project.tagline}</p>
        {project.note ? <p className="note">{project.note}</p> : null}
      </div>
      <div className="row-detail">
        <p className="body">{project.description}</p>
        <ul className="points small">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
      <div className="row-side">
        <p className="stack">{project.tech.join(" · ")}</p>
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

function Timeline({ title, items }: { title: string; items: TimelineItem[] }) {
  if (!items.length) return null;
  return (
    <div className="timeline" data-reveal>
      <h4>{title}</h4>
      {items.map((item) => (
        <div className="timeline-item" key={`${item.title}-${item.place}`}>
          <span className="period">{item.period}</span>
          <div>
            <strong>{item.title}</strong>
            <span className="place">{item.place}</span>
            {item.details ? <p>{item.details}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  useReveal();
  const time = useLocalTime();
  const [copied, setCopied] = useState(false);
  const [featured, ...others] = profile.projects;
  const allSkills = profile.skills.flatMap((g) => g.items);
  const hasTimeline = profile.education.length > 0 || profile.experience.length > 0;
  const links = [
    profile.github && { label: "GitHub", href: profile.github },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin },
    profile.resume && { label: "Résumé", href: profile.resume },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div className="page">
      <header className="masthead">
        <a href="#top" className="wordmark">
          <Seal size={34} />
          <span>{profile.name}</span>
        </a>
        <nav>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#contact" className="nav-cta">
            Contact
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="hero-kicker" data-reveal>
            <span>Portfolio</span>
            <span>Vol. {new Date().getFullYear()}</span>
          </p>
          <h1 data-reveal>
            <span className="line">{firstName}</span>
            <span className="line indent">
              <em>{lastName}</em>
              <span className="asterisk" aria-hidden="true">
                ✳
              </span>
            </span>
          </h1>
          <div className="hero-grid" data-reveal>
            <p className="statement">{profile.headline}</p>
            <dl className="facts">
              <div>
                <dt>Discipline</dt>
                <dd>{profile.role}</dd>
              </div>
              {profile.location ? (
                <div>
                  <dt>Based in</dt>
                  <dd>{profile.location}</dd>
                </div>
              ) : null}
              <div>
                <dt>Local time</dt>
                <dd>{time}</dd>
              </div>
              {profile.lookingFor ? (
                <div>
                  <dt>Status</dt>
                  <dd className="available">
                    <i />
                    {profile.lookingFor}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
          <div className="hero-foot" data-reveal>
            <p className="intro">{profile.intro}</p>
            <div className="hero-actions">
              <a href="#work" className="pill pill-dark">
                View selected work
                <Arrow />
              </a>
              <a href={`mailto:${profile.email}`} className="pill pill-line">
                Say hello
              </a>
            </div>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[...allSkills, ...allSkills].map((skill, i) => (
              <span key={`${skill}-${i}`}>
                {skill}
                <b>✳</b>
              </span>
            ))}
          </div>
        </div>

        <section id="work" className="section">
          <SectionLabel index="01">Selected work</SectionLabel>
          <h2 className="section-title" data-reveal>
            Things I've <em>built</em>
          </h2>
          {featured ? <Featured project={featured} /> : null}
          <div className="rows">
            {others.map((project, i) => (
              <ProjectRow key={project.name} project={project} index={i} />
            ))}
          </div>
        </section>

        <section id="about" className="section">
          <SectionLabel index="02">About</SectionLabel>
          <div className={hasTimeline ? "about" : "about solo"}>
            <blockquote data-reveal>“{profile.about[0]}”</blockquote>
            <div className="about-side">
              {profile.about.slice(1).map((p) => (
                <p key={p.slice(0, 20)} className="body" data-reveal>
                  {p}
                </p>
              ))}
              <Timeline title="Education" items={profile.education} />
              <Timeline title="Experience" items={profile.experience} />
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <SectionLabel index="03">Capabilities</SectionLabel>
          <div className="skills">
            {profile.skills.map((group, i) => (
              <div className="skill" key={group.group} data-reveal>
                <span className="index">{String(i + 1).padStart(2, "0")}</span>
                <h4>{group.group}</h4>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact">
          <SectionLabel index="04">Contact</SectionLabel>
          <h2 data-reveal>
            Let's <em>talk.</em>
          </h2>
          <p className="body" data-reveal>
            {profile.lookingFor ? `${profile.lookingFor}. ` : ""}Email is the fastest way to reach me, and I reply to
            everything.
          </p>
          <div className="contact-email" data-reveal>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <button type="button" onClick={() => void copyEmail()}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          {links.length ? (
            <div className="contact-links" data-reveal>
              {links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="text-link">
                  {link.label}
                  <Arrow />
                </a>
              ))}
            </div>
          ) : null}
        </section>
      </main>

      <footer className="colophon">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Set in Fraunces &amp; Inter Tight</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}
