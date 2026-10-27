import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { profile, projects } from "../profile";
import { Arrow, Chevron, Logo } from "./icons";
import { SECTIONS, isHome, isMac, prefersReducedMotion, projectHref, sectionHref } from "../lib/site";

/** The panel that opens from "Projects" in the top bar: jump straight to any case study. */
export function ProjectsMenu({ onPick }: { onPick: () => void }) {
  return (
    <div className="proj-menu" id="projects-menu" aria-label="Projects">
      <span className="mono proj-menu-title">Jump to a project</span>
      {projects.map((p, i) => (
        <a key={p.id} href={projectHref(p.id)} className="proj-item" onClick={onPick}>
          <span className="proj-thumb">
            <img src={p.cover} alt="" loading="lazy" />
          </span>
          <span className="proj-text">
            <strong>
              <em className="mono">0{i + 1}</em>
              {p.name}
            </strong>
            <span>{p.category}</span>
          </span>
          <Arrow />
        </a>
      ))}
      <a href={sectionHref("projects")} className="proj-all" onClick={onPick}>
        See all projects side by side
        <Arrow down />
      </a>
    </div>
  );
}

export function Nav({ active, progress, scrolled, onPalette }: { active: string; progress: number; scrolled: boolean; onPalette: () => void }) {
  const [open, setOpen] = useState(false);
  const [projOpen, setProjOpen] = useState(false);
  const linksRef = useRef<HTMLDivElement>(null);
  const projRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  // Slide the highlight pill under the active link.
  useLayoutEffect(() => {
    const measure = () => {
      const el = linksRef.current?.querySelector<HTMLElement>(`[data-section="${active}"]`);
      setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    // Link widths change once the web font loads; measure again then.
    void document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  useEffect(() => {
    if (!open && !projOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setProjOpen(false);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (projOpen && !projRef.current?.contains(e.target as Node)) setProjOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open, projOpen]);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <div className="nav-bar">
        <a href={isHome ? "#top" : "/"} className="brand" onClick={() => setOpen(false)}>
          <Logo />
          <span>
            {profile.name}
            <small>{profile.role}</small>
          </span>
        </a>

        <nav className="nav-links" ref={linksRef} aria-label="Sections">
          {pill ? <i className="nav-pill" style={{ transform: `translateX(${pill.left}px)`, width: pill.width }} aria-hidden="true" /> : null}
          {SECTIONS.map((s) =>
            s.id === "projects" ? (
              <div key={s.id} className="nav-drop" ref={projRef} data-section={s.id}>
                <button
                  type="button"
                  className={`nav-link${active === s.id ? " active" : ""}${projOpen ? " expanded" : ""}`}
                  aria-expanded={projOpen}
                  aria-controls="projects-menu"
                  onClick={() => setProjOpen((v) => !v)}
                >
                  {s.label}
                  <Chevron />
                </button>
                {projOpen ? <ProjectsMenu onPick={() => setProjOpen(false)} /> : null}
              </div>
            ) : (
              <a
                key={s.id}
                href={sectionHref(s.id)}
                data-section={s.id}
                className={`nav-link${active === s.id ? " active" : ""}`}
                aria-current={active === s.id ? "true" : undefined}
              >
                {s.label}
              </a>
            ),
          )}
        </nav>

        <div className="nav-actions">
          <button type="button" className="kbd-btn" onClick={onPalette} aria-label="Open command menu" title="Search the site">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <kbd>{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          {profile.resume ? (
            <a className="btn btn-small" href={profile.resume} target="_blank" rel="noreferrer">
              Resume
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
          <div key={s.id} className="mobile-group">
            <a href={sectionHref(s.id)} className={active === s.id ? "active" : undefined} onClick={() => setOpen(false)}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </a>
            {s.id === "projects" ? (
              <div className="mobile-sub">
                {projects.map((p) => (
                  <a key={p.id} href={projectHref(p.id)} onClick={() => setOpen(false)}>
                    <img src={p.cover} alt="" loading="lazy" />
                    {p.name}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </header>
  );
}

export function BackToTop({ progress }: { progress: number }) {
  const r = 20;
  const circumference = 2 * Math.PI * r;
  return (
    <a
      href="#"
      className={progress > 0.06 ? "to-top show" : "to-top"}
      aria-label="Back to top"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }}
    >
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
