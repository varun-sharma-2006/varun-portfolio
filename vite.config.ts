import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { profile, projects } from "./src/profile";

const SITE = "https://varunsharma.vercel.app";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Replace the content of a <meta> tag (by name or property) or a <link rel> href in the built HTML. */
function setTag(html: string, kind: "name" | "property" | "link", key: string, value: string) {
  const v = escape(value);
  if (kind === "link") return html.replace(new RegExp(`(<link rel="${key}" href=")[^"]*(")`), `$1${v}$2`);
  return html.replace(new RegExp(`(<meta\\s+${kind}="${key}"\\s+content=")[^"]*(")`), `$1${v}$2`);
}

/**
 * After the build, write a static page per project (projects/<id>.html) whose title, description and
 * share image are that project's, plus 404.html and sitemap.xml. The React app reads the URL and renders
 * the right page; the static tags are what link previews and search engines see.
 */
function staticPages(): Plugin {
  return {
    name: "static-pages",
    apply: "build",
    enforce: "post", // run after Vite has emitted index.html
    generateBundle(_, bundle) {
      const index = bundle["index.html"];
      if (!index || index.type !== "asset") return;
      const base = String(index.source);

      for (const p of projects) {
        const url = `${SITE}/projects/${p.id}`;
        const title = `${p.name} · ${profile.name}`;
        const description = `${p.tagline} ${p.highlight}`;
        let html = base.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`);
        html = setTag(html, "name", "description", description);
        html = setTag(html, "property", "og:title", title);
        html = setTag(html, "property", "og:description", description);
        html = setTag(html, "property", "og:url", url);
        html = setTag(html, "property", "og:image", `${SITE}/og/${p.id}.png`);
        html = setTag(html, "property", "og:image:alt", `${p.name}: ${p.tagline}`);
        html = setTag(html, "name", "twitter:title", title);
        html = setTag(html, "name", "twitter:image", `${SITE}/og/${p.id}.png`);
        html = setTag(html, "link", "canonical", url);
        this.emitFile({ type: "asset", fileName: `projects/${p.id}.html`, source: html });
      }

      this.emitFile({
        type: "asset",
        fileName: "404.html",
        source: base.replace("<head>", '<head>\n    <meta name="robots" content="noindex" />'),
      });

      const today = new Date().toISOString().slice(0, 10);
      const urls = [`${SITE}/`, ...projects.map((p) => `${SITE}/projects/${p.id}`)];
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
          `\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), staticPages()],
  server: { port: 5180 },
});
