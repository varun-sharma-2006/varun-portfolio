import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { profile } from "./profile";
import { AskAI } from "./components/AskAI";
import { CommandPalette } from "./components/CommandPalette";
import { BackToTop, Nav } from "./components/Nav";
import { CursorGlow, NeuralBackground, StackMarquee } from "./components/effects";
import { Logo } from "./components/icons";
import { PrintResume } from "./components/PrintResume";
import { useReveal, useScrollSpy } from "./hooks";
import { parseRoute } from "./lib/route";
import { SECTIONS, sectionHref } from "./lib/site";
import { NotFound, ProjectPage } from "./pages/ProjectPage";
import { About } from "./sections/About";
import { Certifications } from "./sections/Certifications";
import { Contact } from "./sections/Contact";
import { Education } from "./sections/Education";
import { Experience } from "./sections/Experience";
import { Hero, Highlights } from "./sections/Hero";
import { Now } from "./sections/Now";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";

function Home() {
  return (
    <main id="top">
      <Hero />
      <StackMarquee />
      <Highlights />
      <About />
      <Skills />
      <Projects />
      <Now />
      <Experience />
      <Education />
      <Certifications />
      <Contact />
    </main>
  );
}

export default function App() {
  const route = parseRoute(window.location.pathname);
  useReveal();
  const spy = useScrollSpy();
  const active = route.page === "project" ? "projects" : spy.active;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const closeAI = useCallback(() => setAiOpen(false), []);
  const openAI = useCallback(() => {
    setPaletteOpen(false);
    setAiOpen(true);
  }, []);

  // ⌘K / Ctrl K toggles the command menu from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  let page: ReactNode;
  if (route.page === "home") page = <Home />;
  else if (route.page === "project") page = <ProjectPage id={route.id} />;
  else page = <NotFound />;

  return (
    <>
      <a className="skip" href={route.page === "home" ? "#about" : "#main"}>
        Skip to content
      </a>
      <div className="aurora" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
        <span className="blob b4" />
      </div>
      <div className="grid-bg" aria-hidden="true" />
      <NeuralBackground />
      <CursorGlow />

      <Nav active={active} progress={spy.progress} scrolled={spy.scrolled} onPalette={() => setPaletteOpen(true)} />

      {page}

      <footer className="footer">
        <div className="footer-brand">
          <Logo />
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
        </div>
        <nav aria-label="Footer">
          {SECTIONS.map((s) => (
            <a key={s.id} href={sectionHref(s.id)}>
              {s.label}
            </a>
          ))}
        </nav>
      </footer>

      <BackToTop progress={spy.progress} />

      {aiOpen ? null : (
        <button type="button" className="ai-launch" onClick={() => setAiOpen(true)} aria-haspopup="dialog">
          <span className="ai-ring always" aria-hidden="true" />
          <span className="spark" aria-hidden="true">
            ✦
          </span>
          Ask my AI
        </button>
      )}
      <AskAI open={aiOpen} onClose={closeAI} />
      <CommandPalette open={paletteOpen} onClose={closePalette} onAsk={openAI} />
      <PrintResume />
      <Analytics />
    </>
  );
}
