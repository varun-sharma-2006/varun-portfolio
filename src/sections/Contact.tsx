import { useState, type FormEvent } from "react";
import { profile } from "../profile";
import { Arrow, External } from "../components/icons";
import { sectionNumber } from "../lib/site";
import { mailtoFor, validateContact } from "../contact";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const check = validateContact(form);
    if (!check.ok) {
      setStatus({ kind: "error", message: check.error });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
      const data = (await res.json()) as { ok?: boolean; fallback?: boolean; error?: string };
      if (data.ok) {
        setStatus({ kind: "sent" });
        setForm({ name: "", email: "", message: "", website: "" });
        return;
      }
      if (!data.fallback) {
        setStatus({ kind: "error", message: data.error ?? "Something went wrong. Please email me directly." });
        return;
      }
    } catch {
      // the function isn't there (local dev) or the network failed: fall back below
    }
    // Couldn't send from the site: hand the same message to the visitor's email app.
    window.location.href = mailtoFor(profile.email, check.value);
    setStatus({ kind: "idle" });
  };

  if (status.kind === "sent") {
    return (
      <div className="form-done" role="status">
        <span className="spark" aria-hidden="true">
          ✓
        </span>
        <strong>Message sent. Thank you!</strong>
        <p>I'll reply to your email, usually within a day.</p>
        <button type="button" className="link" onClick={() => setStatus({ kind: "idle" })}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={(e) => void submit(e)} noValidate>
      <div className="field-row">
        <label>
          <span>Name</span>
          <input value={form.name} onChange={set("name")} autoComplete="name" maxLength={100} required />
        </label>
        <label>
          <span>Email</span>
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" maxLength={200} required />
        </label>
      </div>
      <label>
        <span>Message</span>
        <textarea value={form.message} onChange={set("message")} rows={5} maxLength={4000} placeholder="An internship role, a project, or just hello…" required />
      </label>
      {/* Hidden from people; bots that fill it are ignored. */}
      <label className="hp" aria-hidden="true">
        Website
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
      </label>
      {status.kind === "error" ? (
        <p className="form-error" role="alert">
          {status.message}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : "Send message"}
        <Arrow />
      </button>
    </form>
  );
}

export function Contact() {
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
        <div className="contact-info">
          <span className="eyebrow">
            <b>{String(sectionNumber("contact")).padStart(2, "0")}</b>Contact
          </span>
          <h2>
            Let's build something <span className="grad">great together.</span>
          </h2>
          <p>
            {profile.lookingFor ? `${profile.lookingFor}: ${profile.interests.replace(/ · /g, ", ")}. ` : ""}I reply to every message, usually
            within a day.
          </p>
          <button type="button" className="btn btn-glass email-copy" onClick={() => void copy()}>
            {copied ? "Copied ✓" : profile.email}
          </button>
          {links.length ? (
            <div className="contact-links">
              {links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                  <External />
                </a>
              ))}
              <button type="button" className="link-btn" onClick={() => window.print()}>
                Print / save as PDF
              </button>
            </div>
          ) : null}
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
