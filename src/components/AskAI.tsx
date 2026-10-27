import { useEffect, useRef, useState, type FormEvent } from "react";
import { profile } from "../profile";
import { offlineAnswer, sources as sourceNames, SUGGESTED_QUESTIONS, type AskAnswer } from "../knowledge";
import { scrollToSection } from "../lib/site";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
  mode?: AskAnswer["mode"];
}

/** Ask /api/ask; if the function isn't there (local dev) or fails, answer offline from the site content. */
export async function askAI(question: string, history: ChatMessage[]): Promise<AskAnswer> {
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

export function AskAI({ open, onClose }: { open: boolean; onClose: () => void }) {
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
