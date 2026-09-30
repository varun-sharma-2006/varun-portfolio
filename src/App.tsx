import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { caseStudy, otherProjects, profile, type TimelineItem } from "./profile";

const initials = profile.name
  .split(" ")
  .map((p) => p[0])
  .join("")
  .slice(0, 2);

/* ---------- Small building blocks ---------- */

function Arrow() {
  return (
    <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
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

/** Icons for the engineering cards, in the order they appear in profile.ts. */
const ENG_ICON_PATHS = [
  "M3 12h4l3-8 4 16 3-8h4", // look-ahead: signal line
  "M4 15a4 4 0 0 1 3.5-6 5.5 5.5 0 0 1 10.6 1.5A3.5 3.5 0 0 1 18 18H7a3 3 0 0 1-3-3Z", // serverless: cloud
  "M12 3v3M12 18v3M4.2 7.5l2.6 1.5M17.2 15l2.6 1.5M4.2 16.5l2.6-1.5M17.2 9l2.6-1.5M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0", // AI fallback
  "M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6Zm-3 9 2 2 4-4", // secure sign-in: shield check
  "M13 3 5 14h6l-1 7 8-11h-6Z", // lean: bolt
  "M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", // tested: check circle
];

function EngIcon({ index }: { index: number }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ENG_ICON_PATHS[index] ?? ENG_ICON_PATHS[5]} />
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

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="section-head" data-reveal>
      <span className="eyebrow">{eyebrow}</span>
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

function Timeline({ title, items }: { title: string; items: TimelineItem[] }) {
  if (!items.length) return null;
  return (
    <div className="timeline">
      <h4>{title}</h4>
      {items.map((item) => (
        <div className="timeline-item" key={`${item.title}-${item.place}`}>
          <span className="mono">{item.period}</span>
          <div>
            <strong>{item.title}</strong>
            <span>{item.place}</span>
            {item.details ? <p>{item.details}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Sections ---------- */

function Hero() {
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
          Hi, I'm <strong>{profile.name}</strong> — {profile.role.toLowerCase()}
          {profile.location ? ` in ${profile.location}` : ""}.
        </p>
        <h1>
          {profile.headline.split(",")[0]}
          {profile.headline.includes(",") ? (
            <>
              , <span className="grad">{profile.headline.split(",").slice(1).join(",").trim()}</span>
            </>
          ) : null}
        </h1>
        <p className="lead">{profile.intro}</p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#project">
            Explore my flagship project
            <Arrow />
          </a>
          <a className="btn btn-glass" href="#contact">
            Get in touch
          </a>
        </div>
      </div>

      <div className="hero-visual" data-reveal>
        <div className="device">
          <div className="device-bar">
            <span />
            <span />
            <span />
            <em>algo-trade-mu.vercel.app</em>
          </div>
          <img src={caseStudy.heroImage} alt={`${caseStudy.name} portfolio page`} />
        </div>
        <div className="float float-a">
          <span className="mono">Backtest vs buy &amp; hold</span>
          <strong>Honest by design</strong>
        </div>
        <div className="float float-c">
          <span className="mono">Built with</span>
          <strong>Yashika Garg</strong>
        </div>
        <div className="float float-b">
          <span className="mono">Tests passing</span>
          <strong className="grad">107 / 107</strong>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [active, setActive] = useState(0);
  const shot = caseStudy.gallery[active];
  return (
    <div className="gallery" data-reveal>
      <div className="tabs" role="tablist" aria-label="Screens">
        {caseStudy.gallery.map((item, index) => (
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
          <img key={shot.image} src={shot.image} alt={shot.title} />
        </div>
        <div className="stage-caption">
          <strong>{shot.title}</strong>
          <span>{shot.caption}</span>
        </div>
      </div>
    </div>
  );
}

function CaseStudy() {
  return (
    <section id="project" className="section">
      <SectionHead eyebrow="Flagship project" title={<>{caseStudy.name}</>}>
        {caseStudy.tagline}
      </SectionHead>

      <Spotlight className="overview">
        <div className="overview-text">
          <p>{caseStudy.summary}</p>
          <dl>
            <div>
              <dt>Team</dt>
              <dd className="team">
                {caseStudy.team.map((member, i) => (
                  <span key={member.name}>
                    <a href={member.href} target="_blank" rel="noreferrer">
                      {member.name}
                    </a>
                    {i < caseStudy.team.length - 1 ? <em>&amp;</em> : null}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>What we built</dt>
              <dd>{caseStudy.role}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd className="chips">
                {caseStudy.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </dd>
            </div>
          </dl>
          <div className="cta-row">
            {caseStudy.links.map((link, i) => (
              <a key={link.href} className={i === 0 ? "btn btn-primary" : "btn btn-glass"} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <External />
              </a>
            ))}
          </div>
        </div>
        <div className="stats">
          {caseStudy.stats.map((stat) => (
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
        {caseStudy.story.map((step, index) => (
          <Spotlight key={step.title} className="story-card">
            <span className="mono step">0{index + 1}</span>
            <span className="eyebrow">{step.kicker}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </Spotlight>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="section">
      <SectionHead eyebrow="What it does" title={<>Everything a trader needs to <span className="grad">test an idea</span></>} />
      <div className="bento">
        {caseStudy.features.map((feature) => (
          <Spotlight key={feature.title} className={`bento-card ${feature.size}`}>
            <div className="bento-text">
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </div>
            <div className="bento-shot">
              <img src={feature.image} alt={feature.title} loading="lazy" />
            </div>
          </Spotlight>
        ))}
      </div>
    </section>
  );
}

function Screens() {
  return (
    <section id="screens" className="section">
      <SectionHead eyebrow="Take the tour" title="Inside the app">
        Watch a two-minute walkthrough, or pick a screen.
      </SectionHead>
      <div className="demo-video" data-reveal>
        <video controls preload="none" poster={caseStudy.video.poster} playsInline>
          <source src={caseStudy.video.src} type="video/mp4" />
        </video>
        <span className="mono">Product demo · {caseStudy.video.length}</span>
      </div>
      <Gallery />
    </section>
  );
}

function Engineering() {
  return (
    <section id="engineering" className="section">
      <SectionHead eyebrow="Under the hood" title={<>Built like a <span className="grad">real product</span></>}>
        The parts you don't see are where most of the work went.
      </SectionHead>
      <div className="arch" data-reveal>
        {caseStudy.architecture.map((layer, index) => (
          <div key={layer.layer} className="arch-layer">
            <span className="mono">{String(index + 1).padStart(2, "0")}</span>
            <strong>{layer.layer}</strong>
            <ul>
              {layer.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {index < caseStudy.architecture.length - 1 ? <i className="arch-link" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
      <div className="eng-grid">
        {caseStudy.engineering.map((item) => (
          <Spotlight key={item.title} className="eng-card">
            <span className="eng-icon">
              <EngIcon index={caseStudy.engineering.indexOf(item)} />
            </span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </Spotlight>
        ))}
      </div>
    </section>
  );
}

function About() {
  const shown = otherProjects.filter((p) => p.show);
  return (
    <section id="about" className="section">
      <SectionHead eyebrow="About me" title="A bit about me" />
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
          <Timeline title="Education" items={profile.education} />
          <Timeline title="Experience" items={profile.experience} />
        </Spotlight>
        <div className="skills">
          {profile.skills.map((group) => (
            <Spotlight key={group.group} className="skill-card">
              <span className="mono">{group.group}</span>
              <div className="chips">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </Spotlight>
          ))}
        </div>
      </div>
      {shown.length ? (
        <div className="more" data-reveal>
          <span className="eyebrow">More work</span>
          <div className="more-list">
            {shown.map((p) => (
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
        <span className="eyebrow">Contact</span>
        <h2>
          Let's build something <span className="grad">great together.</span>
        </h2>
        <p>{profile.lookingFor ? `${profile.lookingFor}. ` : ""}I reply to every email, usually within a day.</p>
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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="aurora" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>
      <div className="grid-bg" aria-hidden="true" />

      <header className={scrolled ? "nav scrolled" : "nav"}>
        <a href="#top" className="brand">
          <Logo />
          <span>{profile.name}</span>
        </a>
        <nav>
          <a href="#project">Project</a>
          <a href="#features">Features</a>
          <a href="#engineering">Engineering</a>
          <a href="#about">About</a>
        </nav>
        <a className="btn btn-small" href="#contact">
          Contact
        </a>
      </header>

      <main id="top">
        <Hero />
        <CaseStudy />
        <Features />
        <Screens />
        <Engineering />
        <About />
        <Contact />
      </main>

      <footer className="footer">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
