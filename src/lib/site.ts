import { profile, projects } from "../profile";

export const initials = profile.name
  .split(" ")
  .map((p) => p[0])
  .join("")
  .slice(0, 2);

/** Top-bar sections, in page order. Each id must match a <section id>. */
export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "now", label: "Now" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

/** A section's number in the top bar (1-based), shown in its heading. */
export const sectionNumber = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/** True on the one-page home; project pages and the 404 page live at other paths. */
export const isHome = typeof location === "undefined" || location.pathname === "/" || location.pathname === "/index.html";

/** Link to a home-page section from wherever we are. */
export const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

/** Link to a project: its case study on the home page, or its own page elsewhere. */
export const projectHref = (id: string) => (isHome ? `#${id}` : `/projects/${id}`);

export const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) {
    window.location.href = `/#${id}`;
    return;
  }
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  history.replaceState(null, "", `${location.pathname}#${id}`);
};

export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export const totalTests =projects.reduce((sum, p) => sum + (p.stats.find((s) => /test/i.test(s.label))?.value ?? 0), 0);
