/** Contact-form validation, shared by the form and the /api/contact function. */

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export type ContactResult = { ok: true; spam: boolean; value: ContactInput } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: unknown): ContactResult {
  const x = (input ?? {}) as Record<string, unknown>;
  const name = String(x.name ?? "").trim();
  const email = String(x.email ?? "").trim();
  const message = String(x.message ?? "").trim();
  const spam = String(x.website ?? "").trim() !== "";

  if (!name) return { ok: false, error: "Please add your name." };
  if (name.length > 100) return { ok: false, error: "That name is too long." };
  if (!EMAIL.test(email) || email.length > 200) return { ok: false, error: "Please enter a valid email address." };
  if (message.length < 10) return { ok: false, error: "Please write a little more (at least 10 characters)." };
  if (message.length > 4000) return { ok: false, error: "Please keep the message under 4000 characters." };
  return { ok: true, spam, value: { name, email, message } };
}

/** A mailto: link carrying the same message, for when the form can't send. */
export function mailtoFor(to: string, { name, email, message }: ContactInput) {
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
