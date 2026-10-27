import { describe, expect, it } from "vitest";
import { mailtoFor, validateContact } from "../src/contact";

const good = { name: "Asha", email: "asha@example.com", message: "Hi Varun, we have an internship opening." };

describe("contact form validation", () => {
  it("accepts a normal message and trims it", () => {
    const r = validateContact({ ...good, name: "  Asha  " });
    expect(r).toEqual({ ok: true, spam: false, value: good });
  });

  it.each([
    [{ ...good, name: "" }, "name"],
    [{ ...good, email: "not-an-email" }, "valid email"],
    [{ ...good, message: "hi" }, "a little more"],
    [{ ...good, message: "x".repeat(4001) }, "under 4000"],
  ])("rejects bad input %#", (input, phrase) => {
    const r = validateContact(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain(phrase);
  });

  it("flags bots that fill the hidden field", () => {
    const r = validateContact({ ...good, website: "http://spam.example" });
    expect(r.ok && r.spam).toBe(true);
  });

  it("builds a mailto fallback with the message", () => {
    const url = mailtoFor("me@example.com", good);
    expect(url.startsWith("mailto:me@example.com?subject=")).toBe(true);
    expect(decodeURIComponent(url)).toContain(good.message);
  });
});
