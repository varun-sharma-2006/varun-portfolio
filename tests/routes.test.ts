import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseRoute } from "../src/lib/route";
import { projects } from "../src/profile";

describe("routes", () => {
  it("maps paths to pages", () => {
    expect(parseRoute("/")).toEqual({ page: "home" });
    expect(parseRoute("/projects/bidpulse")).toEqual({ page: "project", id: "bidpulse" });
    expect(parseRoute("/projects/bidpulse/")).toEqual({ page: "project", id: "bidpulse" });
    expect(parseRoute("/projects/bidpulse.html")).toEqual({ page: "project", id: "bidpulse" });
    expect(parseRoute("/projects/nope")).toEqual({ page: "missing" });
    expect(parseRoute("/random")).toEqual({ page: "missing" });
  });
});

// Runs after `npm run build` (CI builds first): the static pages the Vite plugin writes.
const dist = join(__dirname, "..", "dist");
describe.runIf(existsSync(dist))("build output", () => {
  it("writes a page per project with its own title, image and canonical URL", () => {
    for (const p of projects) {
      const html = readFileSync(join(dist, "projects", `${p.id}.html`), "utf8");
      expect(html).toContain(`<title>${p.name.replace(/&/g, "&amp;")} · Varun Sharma</title>`);
      expect(html).toContain(`/og/${p.id}.png`);
      expect(html).toContain(`<link rel="canonical" href="https://varunsharma.vercel.app/projects/${p.id}"`);
    }
  });

  it("writes a sitemap listing every page and a noindex 404", () => {
    const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
    for (const p of projects) expect(sitemap).toContain(`/projects/${p.id}</loc>`);
    expect(readFileSync(join(dist, "404.html"), "utf8")).toContain('name="robots" content="noindex"');
  });
});
