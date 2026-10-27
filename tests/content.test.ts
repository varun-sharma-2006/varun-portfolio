import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { profile, projects } from "../src/profile";

const pub = (p: string) => join(__dirname, "..", "public", p);

describe("profile content", () => {
  it("has unique project ids that are safe in URLs", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it("references only images that exist in public/", () => {
    for (const p of projects) {
      expect(existsSync(pub(p.cover)), p.cover).toBe(true);
      for (const s of p.gallery) expect(existsSync(pub(s.image)), s.image).toBe(true);
      if (p.video) {
        expect(existsSync(pub(p.video.src)), p.video.src).toBe(true);
        expect(existsSync(pub(p.video.poster)), p.video.poster).toBe(true);
      }
    }
  });

  it("has a share image for every project page", () => {
    for (const p of projects) expect(existsSync(pub(`og/${p.id}.png`)), p.id).toBe(true);
    expect(existsSync(pub("og.png"))).toBe(true);
  });

  it("gives every project a highlight, links and https URLs", () => {
    for (const p of projects) {
      expect(p.highlight.length, p.id).toBeGreaterThan(20);
      expect(p.links.length, p.id).toBeGreaterThan(0);
      for (const l of p.links) expect(l.href).toMatch(/^https:\/\//);
    }
  });

  it("links certifications to certificate pages, not course pages", () => {
    for (const c of profile.certifications) {
      expect(c.href, c.name).toMatch(/^https:\/\/(www\.coursera\.org\/account\/accomplishments\/verify\/|www\.hackerrank\.com\/certificates\/)/);
    }
  });

  it("ships the resume and app icons it links to", () => {
    for (const f of [profile.resume, "favicon.svg", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "site.webmanifest", "robots.txt"]) {
      expect(existsSync(pub(f)), f).toBe(true);
    }
  });
});
