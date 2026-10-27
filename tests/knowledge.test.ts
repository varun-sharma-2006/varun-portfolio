import { describe, expect, it } from "vitest";
import { offlineAnswer, passages, retrieve, sources } from "../src/knowledge";
import { profile } from "../src/profile";

describe("Ask my AI knowledge", () => {
  it("only cites sections that exist", () => {
    for (const p of passages) expect(sources, p.id).toHaveProperty(p.id);
  });

  it("finds the right section for typical questions", () => {
    expect(retrieve("How does BidPulse handle last-second bids?")[0].id).toBe("bidpulse");
    expect(retrieve("When is he available for an internship?")[0].id).toBe("contact");
    expect(retrieve("Which certifications from HackerRank?")[0].id).toBe("certifications");
    expect(retrieve("freight invoice overcharges precision")[0].id).toBe("freight-audit");
  });

  it("answers offline with the matching passage and its source", () => {
    const a = offlineAnswer("When is he available for an internship?");
    expect(a.mode).toBe("offline");
    expect(a.sources).toEqual(["contact"]);
    expect(a.answer).toContain(profile.graduation);
  });

  it("says it doesn't know instead of guessing", () => {
    const a = offlineAnswer("What is his favourite pizza topping?");
    expect(a.answer).toContain("couldn't find");
    expect(a.answer).toContain(profile.email);
  });
});
