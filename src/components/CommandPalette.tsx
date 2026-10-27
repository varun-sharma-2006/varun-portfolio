import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { profile, projects } from "../profile";
import { SECTIONS, scrollToSection, sectionNumber } from "../lib/site";

export interface Command {
  group: string;
  label: string;
  hint?: string;
  run: () => void;
}

export function CommandPalette({ open, onClose, onAsk }: { open: boolean; onClose: () => void; onAsk: () => void }) {
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
