import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ask from "../api/ask";
import contact from "../api/contact";

const post = (body: unknown, ip = "10.0.0.1") =>
  new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });

// Never reach real services: every test starts with no API keys and opts in explicitly.
beforeEach(() => {
  for (const k of ["GEMINI_API_KEY", "GOOGLE_API_KEY", "RESEND_API_KEY"]) vi.stubEnv(k, "");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("/api/ask", () => {
  it("rejects GET and empty questions", async () => {
    expect((await ask(new Request("http://localhost/api", { method: "GET" }))).status).toBe(405);
    expect((await ask(post({ question: "  " }))).status).toBe(400);
  });

  it("answers offline without an API key", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    vi.stubEnv("GOOGLE_API_KEY", "");
    const res = await ask(post({ question: "How does BidPulse handle last-second bids?" }, "10.0.0.2"));
    const data = await res.json();
    expect(data.mode).toBe("offline");
    expect(data.sources).toEqual(["bidpulse"]);
  });

  it("uses the model's answer and drops sources that don't exist", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            candidates: [{ content: { parts: [{ text: JSON.stringify({ answer: "He built BidPulse.", sources: ["bidpulse", "made-up"] }) }] } }],
          }),
        ),
      ),
    );
    const data = await (await ask(post({ question: "What did he build?" }, "10.0.0.3"))).json();
    expect(data).toEqual({ answer: "He built BidPulse.", sources: ["bidpulse"], mode: "ai" });
  });

  it("falls back offline when the model fails", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    const data = await (await ask(post({ question: "Tell me about RazorGrowth" }, "10.0.0.4"))).json();
    expect(data.mode).toBe("offline");
    expect(data.sources).toEqual(["razorgrowth"]);
  });

  it("tries the next model when one isn't found, and says why it fell back", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubEnv("GEMINI_MODEL", "gemini-old");
    const fetch = vi.fn(async () => new Response("", { status: 404 }));
    vi.stubGlobal("fetch", fetch);
    const data = await (await ask(post({ question: "Tell me about BidPulse" }, "10.0.0.6"))).json();
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(data.mode).toBe("offline");
    expect(data.reason).toContain("gemini-flash-latest");
  });

  it("rate-limits a flood of questions from one IP", async () => {
    let last = 200;
    for (let i = 0; i < 13; i++) last = (await ask(post({ question: "skills?" }, "10.0.0.99"))).status;
    expect(last).toBe(429);
  });
});

describe("/api/contact", () => {
  const msg = { name: "Asha", email: "asha@example.com", message: "Hello, we'd like to talk about an internship." };

  it("rejects invalid input", async () => {
    expect((await contact(post({ ...msg, email: "nope" }, "10.1.0.1"))).status).toBe(400);
  });

  it("asks the page to fall back to email when no key is set", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await contact(post(msg, "10.1.0.2"));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ fallback: true });
  });

  it("quietly drops spam", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const res = await contact(post({ ...msg, website: "spam" }, "10.1.0.3"));
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends through Resend with the visitor as reply-to", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const fetchSpy = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchSpy);
    const res = await contact(post(msg, "10.1.0.4"));
    expect(await res.json()).toEqual({ ok: true });
    const [url, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(JSON.parse(String(init.body))).toMatchObject({ reply_to: msg.email, subject: "Portfolio message from Asha" });
  });
});
