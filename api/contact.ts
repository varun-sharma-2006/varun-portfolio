/**
 * Contact form: emails the message to Varun through Resend (https://resend.com).
 * Needs RESEND_API_KEY. CONTACT_TO (default: the email in profile.ts) and CONTACT_FROM
 * (default: Resend's shared test sender, which can only deliver to the Resend account's own address) are optional.
 * Without a key it answers { fallback: true } and the page opens the visitor's email app instead.
 */
import { profile } from "../src/profile";
import { validateContact } from "../src/contact";

export const config = { runtime: "edge" };

declare const process: { env: Record<string, string | undefined> };

// Best-effort rate limit per instance: 5 messages per 10 minutes per IP.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const result = validateContact(body);
  if (!result.ok) return json({ error: result.error }, 400);
  // Bots fill the hidden "website" field; pretend success and drop it.
  if (result.spam) return json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (recent.length > LIMIT) return json({ error: "Too many messages. Please try again later or email directly." }, 429);

  const key = process.env.RESEND_API_KEY;
  if (!key) return json({ fallback: true }, 503);

  const { name, email, message } = result.value;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || profile.email],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>\nSent from varunsharma.vercel.app`,
    }),
  }).catch(() => null);

  if (!res?.ok) return json({ fallback: true }, 502);
  return json({ ok: true });
}
