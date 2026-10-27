import { useEffect } from "react";
import { profile, projects } from "../profile";
import { Arrow, External } from "../components/icons";
import { CaseStudy } from "../sections/Projects";
import { Contact } from "../sections/Contact";

/** One project on its own page: the full case study, then the neighbouring projects and the contact card. */
export function ProjectPage({ id }: { id: string }) {
  const index = projects.findIndex((p) => p.id === id);
  const p = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  useEffect(() => {
    document.title = `${p.name} · ${profile.name}`;
  }, [p]);

  return (
    <main id="main" className="project-page">
      <a className="back-link" href="/#projects">
        <Arrow /> All projects
      </a>

      <CaseStudy p={p} index={index} expanded />

      <nav className="pager" aria-label="More projects">
        {[
          { dir: "Previous", item: prev },
          { dir: "Next", item: next },
        ].map(({ dir, item }) => (
          <a key={dir} className={`pager-card pager-${dir.toLowerCase()}`} href={`/projects/${item.id}`}>
            <img src={item.cover} alt="" loading="lazy" />
            <span className="mono">{dir} project</span>
            <strong>{item.name}</strong>
            <span>{item.tagline}</span>
          </a>
        ))}
      </nav>

      <p className="project-page-links">
        {p.links.map((l) => (
          <a key={l.href} className="link" href={l.href} target="_blank" rel="noreferrer">
            {l.label} <External />
          </a>
        ))}
      </p>

      <Contact />
    </main>
  );
}

export function NotFound() {
  useEffect(() => {
    document.title = `Page not found · ${profile.name}`;
  }, []);
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">404</span>
      <h1>
        This page <span className="grad">doesn't exist.</span>
      </h1>
      <p>The link may be old or mistyped. Here's where you can go instead:</p>
      <div className="cta-row center">
        <a className="btn btn-primary" href="/">
          Go to the home page <Arrow />
        </a>
        <a className="btn btn-glass" href="/#projects">
          See projects
        </a>
      </div>
    </main>
  );
}
