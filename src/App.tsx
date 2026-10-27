import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { otherProjects, profile, projects, type FeaturedProjectData, type Shot, type TimelineItem } from "./profile";

const initials = profile.name
  .split(" ")
  .map((p) => p[0])
  .join("")
  .slice(0, 2);

/** Top-bar sections, in page order. Each id must match a <section id>. */
const SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const totalTests = projects.reduce((sum, p) => sum + (p.stats.find((s) => /test/i.test(s.label))?.value ?? 0), 0);

/* ---------- Small building blocks ---------- */

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={down ? "M12 5v14M6 13l6 6 6-6" : "M5 12h14M13 6l6 6-6 6"} />
    </svg>
  );
}

function External() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

/** Icons for the engineering cards; each card picks one by index in profile.ts. */
const ENG_ICON_PATHS = [
  "M3 12h4l3-8 4 16 3-8h4", // signal line
  "M4 15a4 4 0 0 1 3.5-6 5.5 5.5 0 0 1 10.6 1.5A3.5 3.5 0 0 1 18 18H7a3 3 0 0 1-3-3Z", // cloud
  "M12 3v3M12 18v3M4.2 7.5l2.6 1.5M17.2 15l2.6 1.5M4.2 16.5l2.6-1.5M17.2 9l2.6-1.5M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0", // AI
  "M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6Zm-3 9 2 2 4-4", // shield check
  "M13 3 5 14h6l-1 7 8-11h-6Z", // bolt
  "M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", // check circle
];

function EngIcon({ index }: { index: number }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ENG_ICON_PATHS[index] ?? ENG_ICON_PATHS[5]} />
    </svg>
  );
}

const SOCIAL_ICONS = {
  GitHub:
    "M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
  LinkedIn: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z",
  Email: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm18 2-10 7L2 6",
};

function SocialIcon({ name }: { name: keyof typeof SOCIAL_ICONS }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={SOCIAL_ICONS[name]} />
    </svg>
  );
}

function Logo() {
  return (
    <span className="logo" aria-hidden="true">
      <span>{initials}</span>
    </span>
  );
}

/** Card whose border and glow follow the cursor. */
function Spotlight({ className = "", children }: { className?: string; children: ReactNode }) {
  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
  };
  return (
    <div className={`spot ${className}`} onMouseMove={onMove} data-reveal>
      {children}
    </div>
  );
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setShown(value);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1400, 1);
        setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}

function SectionHead({ index, eyebrow, title, children }: { index?: number; eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="section-head" data-reveal>
      <span className="eyebrow">
        {index ? <b>{String(index).padStart(2, "0")}</b> : null}
        {eyebrow}
      </span>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/** Scroll progress (0–1) and the id of the section currently under the top bar. */
function useScrollSpy() {
  const [state, setState] = useState({ progress: 0, active: "", scrolled: false });
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      let active = "";
      const line = window.innerHeight * 0.35;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) active = id;
      }
      if (max > 0 && y >= max - 4) active = SECTIONS[SECTIONS.length - 1].id;
      setState({ progress: max > 0 ? Math.min(y / max, 1) : 0, active, scrolled: y > 12 });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return state;
}

/* ---------- Top bar ---------- */

function Nav({ active, progress, scrolled }: { active: string; progress: number; scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const linksRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  // Slide the highlight pill under the active link.
  useLayoutEffect(() => {
    const measure = () => {
      const el = linksRef.current?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
      setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <div className="nav-bar">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <Logo />
          <span>
            {profile.name}
            <small>{profile.role}</small>
          </span>
        </a>

        <nav className="nav-links" ref={linksRef} aria-label="Sections">
          {pill ? <i className="nav-pill" style={{ transform: `translateX(${pill.left}px)`, width: pill.width }} aria-hidden="true" /> : null}
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? "active" : undefined} aria-current={active === s.id ? "true" : undefined}>
              {s.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          {profile.resume ? (
            <a className="btn btn-small" href={profile.resume} target="_blank" rel="noreferrer">
              Résumé
            </a>
          ) : null}
          <button type="button" className="menu-btn" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
          </button>
        </div>
        <span className="nav-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      </div>

      <nav id="mobile-menu" className="mobile-menu" aria-label="Sections" hidden={!open}>
        {SECTIONS.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} className={active === s.id ? "active" : undefined} onClick={() => setOpen(false)}>
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            {s.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function BackToTop({ progress }: { progress: number }) {
  const r = 20;
  const circumference = 2 * Math.PI * r;
  return (
    <a href="#top" className={progress > 0.06 ? "to-top show" : "to-top"} aria-label="Back to top">
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r={r} className="ring-bg" />
        <circle cx="24" cy="24" r={r} className="ring" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} />
      </svg>
      <svg className="to-top-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </a>
  );
}

/* ---------- Sections ---------- */

function Hero() {
  const socials = [
    profile.github && { name: "GitHub" as const, href: profile.github },
    profile.linkedin && { name: "LinkedIn" as const, href: profile.linkedin },
    profile.email && { name: "Email" as const, href: `mailto:${profile.email}` },
  ].filter(Boolean) as Array<{ name: keyof typeof SOCIAL_ICONS; href: string }>;

  const [first, ...rest] = profile.headline.split(",");

  return (
    <section className="hero">
      <div className="hero-copy" data-reveal>
        {profile.lookingFor ? (
          <span className="badge">
            <i />
            {profile.lookingFor}
          </span>
        ) : null}
        <p className="hello">
          Hi, I'm <strong>{profile.name}</strong>, a {profile.role.toLowerCase()} and CS (AI) student, Class of {profile.graduation}.
        </p>
        <h1>
          {first}
          {rest.length ? (
            <>
              , <span className="grad">{rest.join(",").trim()}</span>
            </>
          ) : null}
        </h1>
        <p className="lead">{profile.intro}</p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#projects">
            See my work
            <Arrow down />
          </a>
          <a className="btn btn-glass" href="#contact">
            Get in touch
          </a>
        </div>
        {socials.length ? (
          <div className="socials">
            {socials.map((s) => (
              <a key={s.name} href={s.href} target={s.name === "Email" ? undefined : "_blank"} rel="noreferrer" aria-label={s.name} title={s.name}>
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className="hero-visual" data-reveal>
        <div className="editor">
          <div className="editor-bar">
            <span />
            <span />
            <span />
            <em>varun.ts</em>
          </div>
          <pre className="code" aria-label="A short profile written as code">
            <code>
              <span className="c">{"// hello, world"}</span>
              {"\n"}
              <span className="k">const</span> <span className="v">varun</span> = {"{"}
              {"\n  "}
              <span className="p">role</span>: <span className="s">"{profile.role}"</span>,{"\n  "}
              <span className="p">studying</span>: <span className="s">"B.Tech CSE (AI)"</span>,{"\n  "}
              <span className="p">graduating</span>: <span className="n">{profile.graduation}</span>,{"\n  "}
              <span className="p">based</span>: <span className="s">"{profile.location.split(",")[0]}"</span>,{"\n  "}
              <span className="p">stack</span>: [<span className="s">"Python"</span>, <span className="s">"FastAPI"</span>, <span className="s">"React"</span>, <span className="s">"TS"</span>],{"\n  "}
              <span className="p">shipped</span>: <span className="n">{projects.length}</span>, <span className="c">{"// live, tested, measured"}</span>
              {"\n  "}
              <span className="p">openTo</span>: <span className="s">"Summer 2027 internships"</span>,{"\n"}
              {"};"}
              <span className="caret" aria-hidden="true" />
            </code>
          </pre>
        </div>
        <div className="float float-a">
          <span className="mono">Products live</span>
          <strong className="grad">{projects.length} shipped</strong>
        </div>
        <div className="float float-b">
          <span className="mono">Tests passing</span>
          <strong className="grad">{totalTests}+</strong>
        </div>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to About">
        <span />
      </a>
    </section>
  );
}

function Highlights() {
  const items = [
    { value: projects.length, suffix: "", label: "Products shipped live" },
    { value: totalTests, suffix: "+", label: "Automated tests written" },
    { value: projects.filter((p) => p.team.length === 1).length, suffix: "", label: "Built solo, end to end" },
  ];
  return (
    <div className="highlights" data-reveal>
      {items.map((item) => (
        <div key={item.label}>
          <strong className="grad">
            <CountUp value={item.value} suffix={item.suffix} />
          </strong>
          <span>{item.label}</span>
        </div>
      ))}
      <div>
        <strong className="grad">'{profile.graduation.slice(2)}</strong>
        <span>Graduating, B.Tech CSE (AI)</span>
      </div>
    </div>
  );
}

function About() {
  const facts = [
    { k: "Based in", v: profile.location },
    { k: "Studying", v: "B.Tech CSE (AI), Bennett University" },
    { k: "Graduating", v: profile.graduation },
    { k: "Interested in", v: profile.interests },
  ];
  return (
    <section id="about" className="section">
      <SectionHead index={1} eyebrow="About" title={<>The person behind <span className="grad">the products</span></>} />
      <div className="about">
        <Spotlight className="about-card">
          <div className="about-top">
            <Logo />
            <div>
              <strong>{profile.name}</strong>
              <span>
                {profile.role}
                {profile.location ? ` · ${profile.location}` : ""}
              </span>
            </div>
          </div>
          {profile.about.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <dl className="facts">
            {facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </Spotlight>
        <div className="values">
          {profile.values.map((v, i) => (
            <Spotlight key={v.title} className="value-card">
              <span className="mono">0{i + 1}</span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section">
      <SectionHead index={2} eyebrow="Skills" title={<>Tools I <span className="grad">build with</span></>}>
        Everything here is used in at least one shipped project.
      </SectionHead>
      <div className="skills">
        {profile.skills.map((group, i) => (
          <Spotlight key={group.group} className="skill-card">
            <div className="skill-head">
              <span className="eng-icon">
                <EngIcon index={i} />
              </span>
              <h3>{group.group}</h3>
            </div>
            <div className="chips">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </Spotlight>
        ))}
      </div>
    </section>
  );
}

function Gallery({ shots }: { shots: Shot[] }) {
  const [active, setActive] = useState(0);
  const shot = shots[active];
  return (
    <div className="gallery" data-reveal>
      <div className="tabs" role="tablist" aria-label="Screens">
        {shots.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === active}
            className={index === active ? "tab active" : "tab"}
            onClick={() => setActive(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="stage" role="tabpanel">
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

function ProjectCard({ p, index }: { p: FeaturedProjectData; index: number }) {
  const live = p.links[0];
  return (
    <Spotlight className="project-card">
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

/** A full project case study (overview, stats, story, video, gallery, engineering). Data lives in profile.ts. */
function CaseStudy({ p, index }: { p: FeaturedProjectData; index: number }) {
  const solo = p.team.length === 1;
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
              <dt>{solo ? "Built by" : "Team"}</dt>
              <dd className="team">
                {p.team.map((member, i) => (
                  <span key={member.name}>
                    <a href={member.href} target="_blank" rel="noreferrer">
                      {member.name}
                    </a>
                    {i < p.team.length - 1 ? <em>&amp;</em> : null}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>{solo ? "What I built" : "What we built"}</dt>
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
    </article>
  );
}

function Projects() {
  const more = otherProjects.filter((p) => p.show);
  return (
    <section id="projects" className="section">
      <SectionHead index={3} eyebrow="Projects" title={<>Selected <span className="grad">work</span></>}>
        Three products, each live with real users in mind, automated tests and an honest evaluation. Pick one to read the full case study.
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

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="timeline">
      {items.map((item) => (
        <li key={`${item.title}-${item.place}`} data-reveal>
          <span className="dot" aria-hidden="true" />
          <span className="mono when">{item.period}</span>
          <div className="timeline-card">
            <strong>{item.title}</strong>
            <span className="where">{item.place}</span>
            {item.details ? <p>{item.details}</p> : null}
            {item.tags?.length ? (
              <div className="chips">
                {item.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Experience() {
  if (!profile.experience.length) return null;
  return (
    <section id="experience" className="section">
      <SectionHead index={4} eyebrow="Experience" title={<>Hackathons &amp; <span className="grad">leadership</span></>} />
      <Timeline items={profile.experience} />
    </section>
  );
}

function Education() {
  if (!profile.education.length) return null;
  return (
    <section id="education" className="section">
      <SectionHead index={5} eyebrow="Education" title={<>Where I'm <span className="grad">learning</span></>} />
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

function Contact() {
  const [copied, setCopied] = useState(false);
  const links = [
    profile.github && { label: "GitHub", href: profile.github },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin },
    profile.resume && { label: "Résumé", href: profile.resume },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="section">
      <div className="contact" data-reveal>
        <div className="contact-glow" aria-hidden="true" />
        <span className="eyebrow">
          <b>06</b>Contact
        </span>
        <h2>
          Let's build something <span className="grad">great together.</span>
        </h2>
        <p>
          {profile.lookingFor ? `${profile.lookingFor} in ${profile.interests.toLowerCase().replace(/ · /g, ", ")}. ` : ""}I reply to every email,
          usually within a day.
        </p>
        <div className="cta-row center">
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            Email me
            <Arrow />
          </a>
          <button type="button" className="btn btn-glass" onClick={() => void copy()}>
            {copied ? "Copied ✓" : profile.email}
          </button>
        </div>
        {links.length ? (
          <div className="contact-links">
            {links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <External />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function App() {
  useReveal();
  const { progress, active, scrolled } = useScrollSpy();

  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <div className="aurora" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>
      <div className="grid-bg" aria-hidden="true" />

      <Nav active={active} progress={progress} scrolled={scrolled} />

      <main id="top">
        <Hero />
        <Highlights />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <Logo />
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
        </div>
        <nav aria-label="Footer">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </nav>
      </footer>

      <BackToTop progress={progress} />
    </>
  );
}
