import { useEffect, useState } from "react";
import { profile, type Project, type TimelineItem } from "./profile";

const initials = profile.name
  .split(" ")
  .map((part) => part[0])
  .join("")
  .slice(0, 2);

function Monogram({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="mono-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6dfa8" />
          <stop offset="55%" stopColor="#d4af6a" />
          <stop offset="100%" stopColor="#9c7535" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="#0d0f16" stroke="url(#mono-gold)" strokeWidth="1.5" />
      <text x="24" y="31" textAnchor="middle" fontFamily="Playfair Display Variable, Georgia, serif" fontSize="19" fontWeight="600" fill="url(#mono-gold)">
        {initials}
      </text>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

const NAV = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function ExternalLink({ link, primary }: { link: { label: string; href: string }; primary?: boolean }) {
  return (
    <a className={primary ? "btn btn-gold" : "btn btn-ghost"} href={link.href} target="_blank" rel="noreferrer">
      {link.label}
      <ArrowIcon />
    </a>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="featured" data-reveal>
      <div className="featured-copy">
        <span className="eyebrow">Featured project</span>
        <h3>{project.name}</h3>
        <p className="tagline">{project.tagline}</p>
        <p>{project.description}</p>
        <ul className="highlights">
          {project.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="tags">
          {project.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="actions">
          {project.links.map((link, i) => (
            <ExternalLink key={link.href} link={link} primary={i === 0} />
          ))}
        </div>
      </div>
      {project.image ? (
        <a className="featured-shot" href={project.links[0]?.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`}>
          <img src={project.image} alt={`${project.name} screenshot`} loading="lazy" />
        </a>
      ) : null}
    </article>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="card project-card" data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
      <span className="number">{String(index + 2).padStart(2, "0")}</span>
      <h3>{project.name}</h3>
      <p className="tagline">{project.tagline}</p>
      <p>{project.description}</p>
      <ul className="highlights small">
        {project.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {project.note ? <p className="note">{project.note}</p> : null}
      <div className="tags">
        {project.tech.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="actions">
        {project.links.map((link) => (
          <ExternalLink key={link.href} link={link} />
        ))}
      </div>
    </article>
  );
}

function Timeline({ title, items }: { title: string; items: TimelineItem[] }) {
  if (!items.length) return null;
  return (
    <div className="timeline" data-reveal>
      <h3>{title}</h3>
      <ol>
        {items.map((item) => (
          <li key={`${item.title}-${item.place}`}>
            <span className="period">{item.period}</span>
            <strong>{item.title}</strong>
            <span className="place">{item.place}</span>
            {item.details ? <p>{item.details}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function App() {
  useReveal();
  const [copied, setCopied] = useState(false);
  const [featured, ...others] = profile.projects;
  const contactLinks = [
    profile.github && { label: "GitHub", href: profile.github },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin },
    profile.resume && { label: "Resume", href: profile.resume },
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
    <>
      <header className="topbar">
        <a className="brand" href="#top">
          <Monogram size={38} />
          <span>{profile.name}</span>
        </a>
        <nav>
          {NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy" data-reveal>
            {profile.lookingFor ? (
              <span className="status">
                <i />
                {profile.lookingFor}
              </span>
            ) : null}
            <h1>
              {profile.name.split(" ")[0]} <em>{profile.name.split(" ").slice(1).join(" ")}</em>
            </h1>
            <p className="role">
              {profile.role}
              {profile.location ? ` · ${profile.location}` : ""}
            </p>
            <p className="headline">{profile.headline}</p>
            <p className="intro">{profile.intro}</p>
            <div className="actions">
              <a className="btn btn-gold" href="#work">
                See my work
              </a>
              <a className="btn btn-ghost" href="#contact">
                Get in touch
              </a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orb" />
            <Monogram size={132} />
          </div>
        </section>

        <section id="work" className="section">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Selected work</span>
            <h2>Projects</h2>
          </div>
          {featured ? <FeaturedProject project={featured} /> : null}
          <div className="project-grid">
            {others.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))}
          </div>
        </section>

        <section id="about" className="section about">
          <div className="section-head" data-reveal>
            <span className="eyebrow">About</span>
            <h2>A little about me</h2>
          </div>
          <div className={profile.education.length || profile.experience.length ? "about-grid" : "about-grid single"}>
            <div className="about-copy" data-reveal>
              {profile.about.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <div className="about-side">
              <Timeline title="Education" items={profile.education} />
              <Timeline title="Experience" items={profile.experience} />
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Toolkit</span>
            <h2>Skills</h2>
          </div>
          <div className="skills-grid">
            {profile.skills.map((group) => (
              <div className="card skill-card" key={group.group} data-reveal>
                <h3>{group.group}</h3>
                <div className="tags">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact" data-reveal>
          <span className="eyebrow">Contact</span>
          <h2>
            Let's build something <em>together</em>.
          </h2>
          <p>{profile.lookingFor ? `${profile.lookingFor}. ` : ""}The fastest way to reach me is email.</p>
          <div className="actions center">
            <a className="btn btn-gold" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <button type="button" className="btn btn-ghost" onClick={() => void copyEmail()}>
              {copied ? "Copied ✓" : "Copy email"}
            </button>
            {contactLinks.map((link) => (
              <ExternalLink key={link.href} link={link} />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Built with React &amp; TypeScript</span>
      </footer>
    </>
  );
}
