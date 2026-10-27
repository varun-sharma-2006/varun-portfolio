import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { otherProjects, profile, projects, type Certification, type FeaturedProjectData, type Shot, type TimelineItem } from "./profile";
import { offlineAnswer, sources as sourceNames, SUGGESTED_QUESTIONS, type AskAnswer } from "./knowledge";
import { GH_USER, githubSummary, type GitHubData } from "./github";

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
  { id: "now", label: "Now" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

/** A section's number in the top bar (1-based), shown in its heading. */
const sectionNumber = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  history.replaceState(null, "", `#${id}`);
};

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

const totalTests =projects.reduce((sum, p) => sum + (p.stats.find((s) => /test/i.test(s.label))?.value ?? 0), 0);

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

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/** A slowly drifting neural-network constellation behind the page; nodes link up near the cursor. */
function NeuralBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -1e4, y: -1e4 };
    let w = 0;
    let h = 0;
    let frame = 0;
    let nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(95, (w * h) / 15000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20;
          if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          if (n.y > h + 20) n.y = -20;
        }
      }
      const link = 140;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(140, 150, 255, ${(1 - d / link) * 0.22})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 200) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - dm / 200) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = dm < 200 ? "rgba(165, 243, 252, 0.95)" : "rgba(196, 181, 253, 0.7)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (reduce) draw();
    };
    const onVisible = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) draw();
    };
    const onResize = () => {
      resize();
      if (reduce) draw();
    };

    resize();
    draw();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return <canvas className="neural" ref={ref} aria-hidden="true" />;
}

/** A soft glow that follows the mouse (pointer devices only). */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia?.("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      ref.current?.style.setProperty("transform", `translate(${e.clientX}px, ${e.clientY}px)`);
      ref.current?.classList.add("on");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return <div className="cursor-glow" ref={ref} aria-hidden="true" />;
}

/** Types each phrase, pauses, deletes it and moves to the next. */
function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setLength(words[index].length);
      return;
    }
    const word = words[index];
    let t: number;
    if (!deleting && length < word.length) t = window.setTimeout(() => setLength(length + 1), 55);
    else if (!deleting) t = window.setTimeout(() => setDeleting(true), 1700);
    else if (length > 0) t = window.setTimeout(() => setLength(length - 1), 26);
    else
      t = window.setTimeout(() => {
        setDeleting(false);
        setIndex((index + 1) % words.length);
      }, 250);
    return () => clearTimeout(t);
  }, [length, deleting, index, words]);
  return (
    <span className="typed" aria-live="off">
      <span className="grad">{words[index].slice(0, length)}</span>
      <i className="type-caret" aria-hidden="true" />
    </span>
  );
}

const TYPED = ["AI agents with guardrails", "LLM pipelines that cite evidence", "honest fintech tools", "real-time auction systems"];

/** Every technology across the projects, scrolling past in a loop. */
function StackMarquee() {
  const stack = Array.from(new Set(projects.flatMap((p) => p.stack)));
  return (
    <div className="marquee" aria-label={`Technologies: ${stack.join(", ")}`}>
      <div className="marquee-track" aria-hidden="true">
        {[...stack, ...stack].map((s, i) => (
          <span key={`${s}-${i}`}>
            <i>✦</i>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Ask my AI ---------- */

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
  mode?: AskAnswer["mode"];
}

/** Ask /api/ask; if the function isn't there (local dev) or fails, answer offline from the site content. */
async function askAI(question: string, history: ChatMessage[]): Promise<AskAnswer> {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, history: history.slice(-4).map(({ role, text }) => ({ role, text })) }),
    });
    const data = (await res.json()) as AskAnswer;
    if (typeof data?.answer === "string" && data.answer) return data;
  } catch {
    // fall through
  }
  return offlineAnswer(question);
}

function AskAI({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const send = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    const history = messages;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    const answer = await askAI(q, history);
    setMessages((m) => [...m, { role: "assistant", text: answer.answer, sources: answer.sources, mode: answer.mode }]);
    setBusy(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  if (!open) return null;
  return (
    <div className="ai-panel" role="dialog" aria-modal="false" aria-label="Ask my AI">
      <span className="ai-ring always" aria-hidden="true" />
      <div className="ai-head">
        <span className="spark" aria-hidden="true">
          ✦
        </span>
        <div>
          <strong>Ask my AI</strong>
          <span>Answers only from this site, with sources</span>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className="ai-body" ref={listRef} aria-live="polite">
        {messages.length === 0 ? (
          <div className="ai-empty">
            <p>
              Hi! I answer questions about {profile.name.split(" ")[0]} using only what's on this site, and I link to where I found it. Try one of these:
            </p>
            <div className="ai-suggest">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button key={q} type="button" onClick={() => void send(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            <p>{m.text}</p>
            {m.role === "assistant" && (m.sources?.length || m.mode === "offline") ? (
              <div className="msg-meta">
                {m.sources?.map((s) => (
                  <a
                    key={s}
                    href={`#${s}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(s);
                      if (window.innerWidth < 700) onClose();
                    }}
                  >
                    {sourceNames[s] ?? s} ↗
                  </a>
                ))}
                {m.mode === "offline" ? <em title="The AI model was unavailable, so this is the closest passage from the site">offline answer</em> : null}
              </div>
            ) : null}
          </div>
        ))}
        {busy ? (
          <div className="msg msg-assistant typing" aria-label="Thinking">
            <i />
            <i />
            <i />
          </div>
        ) : null}
      </div>

      <form className="ai-form" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about projects, skills, availability…"
          maxLength={300}
          aria-label="Your question"
        />
        <button type="submit" className="send" disabled={!input.trim() || busy} aria-label="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </div>
  );
}

/* ---------- Command palette (⌘K / Ctrl K) ---------- */

interface Command {
  group: string;
  label: string;
  hint?: string;
  run: () => void;
}

function CommandPalette({ open, onClose, onAsk }: { open: boolean; onClose: () => void; onAsk: () => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      { group: "Actions", label: "Ask my AI about Varun", hint: "Chat", run: onAsk },
      {
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        run: () => {
          void navigator.clipboard?.writeText(profile.email).then(() => setToast("Email copied"));
        },
      },
      { group: "Actions", label: "Open resume", hint: "PDF", run: () => window.open(profile.resume, "_blank", "noopener") },
      { group: "Actions", label: "Send an email", run: () => (window.location.href = `mailto:${profile.email}`) },
      { group: "Links", label: "GitHub", hint: "github.com", run: () => window.open(profile.github, "_blank", "noopener") },
      { group: "Links", label: "LinkedIn", hint: "linkedin.com", run: () => window.open(profile.linkedin, "_blank", "noopener") },
      ...SECTIONS.map((s) => ({ group: "Sections", label: s.label, hint: `0${sectionNumber(s.id)}`, run: () => scrollToSection(s.id) })),
      ...projects.flatMap((p) => [
        { group: "Projects", label: p.name, hint: p.category, run: () => scrollToSection(p.id) },
        ...p.links.map((l) => ({
          group: "Projects",
          label: `${p.name}: ${l.label.toLowerCase()}`,
          hint: "↗",
          run: () => window.open(l.href, "_blank", "noopener"),
        })),
      ]),
    ],
    [onAsk],
  );

  const shown = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return commands;
    return commands.filter((c) => {
      const hay = `${c.group} ${c.label} ${c.hint ?? ""}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [query, commands]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setIndex(0);
    setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => {
      setToast("");
      onClose();
    }, 900);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!open) return null;

  const pick = (c: Command | undefined) => {
    if (!c) return;
    c.run();
    if (c.label !== "Copy email address") onClose();
  };

  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, shown.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(shown[index]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  let lastGroup = "";
  return (
    <div className="palette-backdrop" onMouseDown={onClose}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command menu" onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKey}>
        <div className="palette-input">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sections, projects, links…"
            aria-label="Search commands"
            aria-activedescendant={shown[index] ? `cmd-${index}` : undefined}
            aria-controls="palette-list"
          />
          <kbd>Esc</kbd>
        </div>
        <div className="palette-list" id="palette-list" role="listbox">
          {shown.length === 0 ? <p className="palette-empty">No matches. Try "projects" or "email".</p> : null}
          {shown.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : "";
            lastGroup = c.group;
            return (
              <div key={`${c.group}-${c.label}`}>
                {header ? <span className="mono palette-group">{header}</span> : null}
                <button
                  type="button"
                  id={`cmd-${i}`}
                  role="option"
                  aria-selected={i === index}
                  className={i === index ? "palette-item active" : "palette-item"}
                  onMouseMove={() => setIndex(i)}
                  onClick={() => pick(c)}
                  ref={(el) => {
                    if (i === index) el?.scrollIntoView({ block: "nearest" });
                  }}
                >
                  <span>{c.label}</span>
                  {c.hint ? <em>{c.hint}</em> : null}
                </button>
              </div>
            );
          })}
        </div>
        <div className="palette-foot mono">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to move
          </span>
          <span>
            <kbd>↵</kbd> to select
          </span>
          {toast ? <strong className="palette-toast">{toast} ✓</strong> : null}
        </div>
      </div>
    </div>
  );
}

/* ---------- Top bar ---------- */

function Chevron() {
  return (
    <svg className="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** The panel that opens from "Projects" in the top bar: jump straight to any case study. */
function ProjectsMenu({ onPick }: { onPick: () => void }) {
  return (
    <div className="proj-menu" id="projects-menu" role="menu" aria-label="Projects">
      <span className="mono proj-menu-title">Jump to a project</span>
      {projects.map((p, i) => (
        <a key={p.id} href={`#${p.id}`} role="menuitem" className="proj-item" onClick={onPick}>
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
      <a href="#projects" role="menuitem" className="proj-all" onClick={onPick}>
        See all projects side by side
        <Arrow down />
      </a>
    </div>
  );
}

function Nav({ active, progress, scrolled, onPalette }: { active: string; progress: number; scrolled: boolean; onPalette: () => void }) {
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
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
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
                  aria-haspopup="menu"
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
                href={`#${s.id}`}
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
            <a href={`#${s.id}`} className={active === s.id ? "active" : undefined} onClick={() => setOpen(false)}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </a>
            {s.id === "projects" ? (
              <div className="mobile-sub">
                {projects.map((p) => (
                  <a key={p.id} href={`#${p.id}`} onClick={() => setOpen(false)}>
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
        <p className="typeline">
          <span className="spark" aria-hidden="true">
            ✦
          </span>
          Shipping <Typewriter words={TYPED} />
        </p>
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
          <span className="ai-ring always" aria-hidden="true" />
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
              <span className="p">building</span>: [<span className="s">"AI agents"</span>, <span className="s">"fintech"</span>],{"\n  "}
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
      <SectionHead index={sectionNumber("about")} eyebrow="About" title={<>The person behind <span className="grad">the products</span></>} />
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
      <SectionHead index={sectionNumber("skills")} eyebrow="Skills" title={<>Tools I <span className="grad">build with</span></>}>
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

/* ---------- Now + live GitHub activity ---------- */

// GitHub's public events API only covers the last 30 days.
const GH_DAYS = 30;

/** Cached copy from /api/github; straight from GitHub if that isn't available (e.g. local dev). */
async function loadGitHub(): Promise<GitHubData> {
  const cacheKey = `gh:${GH_USER}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) ?? "null") as GitHubData | null;
    if (cached && Date.now() - cached.fetched < 30 * 60 * 1000) return cached;
  } catch {
    // storage unavailable
  }
  let data: GitHubData;
  try {
    const res = await fetch("/api/github");
    if (!res.ok || !res.headers.get("content-type")?.includes("json")) throw new Error(String(res.status));
    data = (await res.json()) as GitHubData;
  } catch {
    data = await githubSummary();
  }
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {
    // storage unavailable
  }
  return data;
}

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "a month ago" : `${months} months ago`;
}

function ActivityBars({ days }: { days: Record<string, number> }) {
  // GitHub timestamps are UTC, so bars are UTC days, oldest on the left.
  const DAY = 86400000;
  const today = Math.floor(Date.now() / DAY) * DAY;
  const bars = Array.from({ length: GH_DAYS }, (_, i) => {
    const t = today - (GH_DAYS - 1 - i) * DAY;
    const key = new Date(t).toISOString().slice(0, 10);
    return { key, count: days[key] ?? 0, label: new Date(t).toLocaleDateString("en", { day: "numeric", month: "short", timeZone: "UTC" }) };
  });
  const max = Math.max(1, ...bars.map((b) => b.count));
  const total = bars.reduce((n, b) => n + b.count, 0);
  const active = bars.filter((b) => b.count > 0).length;
  return (
    <div className="bars-wrap">
      <div className="bars" role="img" aria-label={`${total} public GitHub events on ${active} of the last ${GH_DAYS} days`}>
        {bars.map((b) => (
          <span key={b.key} className={b.count ? "bar" : "bar empty"} title={`${b.label}: ${b.count} event${b.count === 1 ? "" : "s"}`}>
            <i style={{ height: b.count ? `${Math.max(10, (b.count / max) * 100)}%` : undefined }} />
          </span>
        ))}
      </div>
      <div className="bars-axis mono">
        <span>{bars[0].label}</span>
        <span>
          {total} events · {active} active days
        </span>
        <span>Today</span>
      </div>
    </div>
  );
}

function Now() {
  const [gh, setGh] = useState<GitHubData | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    loadGitHub()
      .then((d) => alive && setGh(d))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="now" className="section">
      <SectionHead index={sectionNumber("now")} eyebrow="Now" title={<>What I'm <span className="grad">up to</span></>}>
        The latest, plus my public GitHub activity, pulled live.
      </SectionHead>
      <div className="now-grid">
        <Spotlight className="now-card">
          <span className="badge">
            <i />
            Updated {profile.nowUpdated}
          </span>
          <ul className="now-list">
            {profile.now.map((n) => (
              <li key={n.label}>
                <span className="mono">{n.label}</span>
                <p>{n.text}</p>
              </li>
            ))}
          </ul>
        </Spotlight>

        <Spotlight className="gh-card">
          <div className="gh-head">
            <span className="gh-logo" aria-hidden="true">
              <SocialIcon name="GitHub" />
            </span>
            <div>
              <strong>@{GH_USER}</strong>
              <span>{gh ? `${gh.repos} public repositories` : failed ? "Live data unavailable right now" : "Loading live data…"}</span>
            </div>
            <a className="link" href={profile.github} target="_blank" rel="noreferrer">
              Profile <External />
            </a>
          </div>
          {gh ? (
            <>
              <ActivityBars days={gh.days} />
              <ul className="gh-repos">
                {gh.recent.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noreferrer">
                      <strong>{r.name}</strong>
                      {r.description ? <span>{r.description}</span> : null}
                    </a>
                    <em className="mono">
                      {r.language ? <b>{r.language}</b> : null}
                      {timeAgo(r.pushed)}
                    </em>
                  </li>
                ))}
              </ul>
            </>
          ) : failed ? (
            <p className="gh-fail">
              GitHub's API didn't respond.{" "}
              <a href={profile.github} target="_blank" rel="noreferrer">
                See my activity on GitHub <External />
              </a>
            </p>
          ) : (
            <div className="gh-skeleton" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          )}
        </Spotlight>
      </div>
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
      <SectionHead index={sectionNumber("experience")} eyebrow="Experience" title={<>Hackathons &amp; <span className="grad">leadership</span></>} />
      <Timeline items={profile.experience} />
    </section>
  );
}

function Education() {
  if (!profile.education.length) return null;
  return (
    <section id="education" className="section">
      <SectionHead index={sectionNumber("education")} eyebrow="Education" title={<>Where I'm <span className="grad">learning</span></>} />
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

/** Issuer initials for the certificate badge, e.g. "BITS Pilani" -> "BP", "HackerRank" -> "HR". */
const issuerMark = (c: Certification) => {
  const words = (c.issuer || c.platform).split(/\s+/);
  const letters = words.length > 1 ? words.map((w) => w[0]).join("") : (words[0].match(/[A-Z]/g)?.join("") ?? words[0][0]);
  return letters.toUpperCase().slice(0, 2);
};

function Certifications() {
  const certs = profile.certifications;
  if (!certs.length) return null;
  const groups = (["Skill test", "Course"] as const)
    .map((kind) => ({ kind, items: certs.filter((c) => c.kind === kind) }))
    .filter((g) => g.items.length);
  return (
    <section id="certifications" className="section">
      <SectionHead index={sectionNumber("certifications")} eyebrow="Certifications" title={<>Skills, <span className="grad">certified</span></>}>
        {certs.length} certificates from HackerRank and Coursera. Click any to see it.
      </SectionHead>
      {groups.map((g) => (
        <div key={g.kind} className="cert-group">
          <span className="mono cert-group-title">{g.kind === "Skill test" ? "Skill certifications" : "Courses"}</span>
          <div className="cert-grid">
            {g.items.map((c) => (
              <a key={c.href} className={`cert cert-${c.platform.toLowerCase()}`} href={c.href} target="_blank" rel="noreferrer" data-reveal>
                <span className="cert-mark" aria-hidden="true">
                  {issuerMark(c)}
                </span>
                <span className="cert-text">
                  <strong>{c.name}</strong>
                  <span>
                    {c.issuer && c.issuer !== c.platform ? `${c.issuer} · ` : ""}
                    {c.platform}
                  </span>
                </span>
                <span className="cert-open">
                  View <External />
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const links = [
    profile.github && { label: "GitHub", href: profile.github },
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin },
    profile.resume && { label: "Resume", href: profile.resume },
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
          <b>{String(sectionNumber("contact")).padStart(2, "0")}</b>Contact
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

  return (
    <>
      <a className="skip" href="#about">
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

      <Nav active={active} progress={progress} scrolled={scrolled} onPalette={() => setPaletteOpen(true)} />

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
      <Analytics />
    </>
  );
}
