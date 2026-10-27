import { useId, useRef, useState, type KeyboardEvent } from "react";
import { otherProjects, profile, projects, type FeaturedProjectData, type Shot } from "../profile";
import { Arrow, Chevron, EngIcon, External } from "../components/icons";
import { CountUp, SectionHead, Spotlight } from "../components/ui";
import { sectionNumber } from "../lib/site";

export function Gallery({ shots }: { shots: Shot[] }) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabsRef = useRef<HTMLDivElement>(null);
  const shot = shots[active];

  // Arrow keys, Home and End move between tabs (the standard tabs keyboard pattern).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: shots.length - 1 };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const next = (moves[e.key] + shots.length) % shots.length;
    setActive(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div className="gallery" data-reveal>
      <div className="tabs" role="tablist" aria-label="Screens" ref={tabsRef} onKeyDown={onKeyDown}>
        {shots.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${uid}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${uid}-panel`}
            tabIndex={index === active ? 0 : -1}
            className={index === active ? "tab active" : "tab"}
            onClick={() => setActive(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="stage" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${active}`}>
        <div className="stage-frame">
          <img key={shot.image} src={shot.image} alt={shot.title} loading="lazy" />
        </div>
        <div className="stage-caption">
          <strong>{shot.title}</strong>
          <span>{shot.caption}</span>
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({ p, index }: { p: FeaturedProjectData; index: number }) {
  const live = p.links[0];
  return (
    <Spotlight className="project-card">
      <span className="ai-ring" aria-hidden="true" />
      <a href={`#${p.id}`} className="project-cover" aria-label={`Read the ${p.name} case study`}>
        <img src={p.cover} alt="" loading="lazy" />
      </a>
      <div className="project-body">
        <div className="project-meta">
          <span className="mono">0{index + 1}</span>
          <span className="tag">{p.category}</span>
          {p.event ? <span className="tag tag-event">{p.event}</span> : null}
        </div>
        <h3>{p.name}</h3>
        <p>{p.tagline}</p>
        <p className="project-highlight">
          <span aria-hidden="true">✦</span>
          {p.highlight}
        </p>
        <div className="project-stats">
          {p.stats.slice(0, 3).map((s) => (
            <div key={s.label}>
              <strong>
                {s.value}
                {s.suffix}
              </strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="project-actions">
          <a className="btn btn-glass btn-small-glass" href={`#${p.id}`}>
            Case study
            <Arrow down />
          </a>
          {live ? (
            <a className="link" href={live.href} target="_blank" rel="noreferrer">
              Live demo <External />
            </a>
          ) : null}
        </div>
      </div>
    </Spotlight>
  );
}

/**
 * A project case study (overview, stats, story, then video, gallery and engineering). On the home page the second
 * half starts collapsed so all four projects can be skimmed; the project's own page shows everything.
 */
export function CaseStudy({ p, index, expanded = false }: { p: FeaturedProjectData; index: number; expanded?: boolean }) {
  const [open, setOpen] = useState(expanded);
  const extras = `${p.video ? "demo video, " : ""}${p.gallery.length} screens and ${p.engineering.length} engineering notes`;
  return (
    <article id={p.id} className="case">
      <div className="case-head" data-reveal>
        <span className="case-num grad">0{index + 1}</span>
        <div>
          <span className="eyebrow">
            Case study · {p.category}
            {p.event ? ` · ${p.event}` : ""}
          </span>
          <h3>{p.name}</h3>
          <p>{p.tagline}</p>
        </div>
      </div>

      <Spotlight className="overview">
        <div className="overview-text">
          <p>{p.summary}</p>
          <dl>
            <div>
              <dt>What I built</dt>
              <dd>{p.role}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd className="chips">
                {p.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </dd>
            </div>
          </dl>
          <div className="cta-row">
            {p.links.map((link, i) => (
              <a key={link.href} className={i === 0 ? "btn btn-primary" : "btn btn-glass"} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <External />
              </a>
            ))}
          </div>
        </div>
        <div className="stats">
          {p.stats.map((stat) => (
            <div key={stat.label} className="stat">
              <strong className="grad">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </Spotlight>

      <div className="story">
        {p.story.map((step, i) => (
          <Spotlight key={step.title} className="story-card">
            <span className="mono step">0{i + 1}</span>
            <span className="eyebrow">{step.kicker}</span>
            <h4>{step.title}</h4>
            <p>{step.body}</p>
          </Spotlight>
        ))}
      </div>

      {open ? (
        <div id={`${p.id}-more`}>
          {p.video ? (
            <div className="demo-video" data-reveal>
              <video controls preload="none" poster={p.video.poster} playsInline>
                <source src={p.video.src} type="video/mp4" />
              </video>
              <span className="mono">Product demo · {p.video.length}</span>
            </div>
          ) : null}

          <Gallery shots={p.gallery} />

          <div className="eng-grid">
            {p.engineering.map((item) => (
              <Spotlight key={item.title} className="eng-card">
                <span className="eng-icon">
                  <EngIcon index={item.icon} />
                </span>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </Spotlight>
            ))}
          </div>
        </div>
      ) : null}

      {expanded ? null : (
        <div className="case-more">
          <button type="button" className="btn btn-glass" aria-expanded={open} aria-controls={`${p.id}-more`} onClick={() => setOpen((v) => !v)}>
            {open ? "Show less" : `Show more: ${extras}`}
            <Chevron />
          </button>
          <a className="link" href={`/projects/${p.id}`}>
            Open as its own page <Arrow />
          </a>
        </div>
      )}
    </article>
  );
}

export function Projects() {
  const more = otherProjects.filter((p) => p.show);
  return (
    <section id="projects" className="section">
      <SectionHead index={sectionNumber("projects")} eyebrow="Projects" title={<>Selected <span className="grad">work</span></>}>
        {projects.length} products, each live, tested and honestly evaluated. Pick one to read the full case study.
      </SectionHead>
      <div className="project-grid">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} p={p} index={i} />
        ))}
      </div>

      {projects.map((p, i) => (
        <CaseStudy key={p.id} p={p} index={i} />
      ))}

      {more.length ? (
        <div className="more" data-reveal>
          <span className="eyebrow">More on GitHub</span>
          <div className="more-list">
            {more.map((p) => (
              <a key={p.href} href={p.href} target="_blank" rel="noreferrer">
                <strong>{p.name}</strong>
                <span>{p.tagline}</span>
                <External />
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p className="coming" data-reveal>
          <span className="mono">Next up</span> More case studies are on the way.{" "}
          <a href={profile.github} target="_blank" rel="noreferrer">
            Follow along on GitHub <External />
          </a>
        </p>
      )}
    </section>
  );
}
