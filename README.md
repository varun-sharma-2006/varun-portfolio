# Varun Sharma · Portfolio

[![CI](https://github.com/varun-sharma-2006/varun-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/varun-sharma-2006/varun-portfolio/actions/workflows/ci.yml)

My personal portfolio site: projects, skills, certifications and contact details. Live at
[varunsharma.vercel.app](https://varunsharma.vercel.app).

## Edit the content

Everything shown on the site lives in [`src/profile.ts`](src/profile.ts). Change it and save; empty fields are
hidden. "Ask my AI", the printable resume, the project pages and the sitemap all update from it automatically.
The downloadable resume is `public/resume.pdf`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # production build in dist/
npm test           # content, AI search, contact form, API functions, routes, built pages
npm run typecheck
```

Locally there is no `/api`: "Ask my AI" answers offline, the GitHub section calls GitHub directly, and the
contact form opens your email app.

## Deploy

Import this repository at [vercel.com/new](https://vercel.com/new). Vercel detects Vite automatically, and the
functions in [`api/`](api) deploy with it. Every push to the main branch redeploys the site; GitHub Actions runs
the type check, build and tests on every push.

Optional environment variables (Vercel → Project → Settings → Environment Variables):

| Variable | What it does |
|---|---|
| `GEMINI_API_KEY` | Turns on AI answers in "Ask my AI" ([`api/ask.ts`](api/ask.ts)). Without it, answers come offline from the best-matching passage. |
| `GEMINI_MODEL` | Overrides the model (default `gemini-3.8-flash`). |
| `RESEND_API_KEY` | Lets the contact form send email via [Resend](https://resend.com) ([`api/contact.ts`](api/contact.ts)). Without it, the form opens the visitor's email app. |
| `CONTACT_TO` / `CONTACT_FROM` | Where messages go (default: the email in `profile.ts`) and the sender (default: Resend's test sender, which only delivers to your Resend account's email). |
| `GITHUB_TOKEN` | Raises GitHub's rate limit for the "Now" section ([`api/github.ts`](api/github.ts)). Read-only, no scopes needed. |

Analytics: enable **Web Analytics** in the Vercel project to see visits.

## Where things live

- [`src/profile.ts`](src/profile.ts): all content
- [`src/App.tsx`](src/App.tsx): page shell; [`src/lib/route.ts`](src/lib/route.ts) picks home, a project page or 404
- [`src/sections/`](src/sections): one file per home-page section
- [`src/components/`](src/components): top bar, Ask my AI, command menu, effects, printable resume
- [`src/pages/ProjectPage.tsx`](src/pages/ProjectPage.tsx): `/projects/<id>` pages
- [`src/knowledge.ts`](src/knowledge.ts): what "Ask my AI" knows, built from `profile.ts`
- [`vite.config.ts`](vite.config.ts): writes a static page per project (own title and share image), `404.html` and `sitemap.xml`
- [`public/og.png`](public/og.png), [`public/og/`](public/og): link-preview images
- [`tests/`](tests): Vitest suite
