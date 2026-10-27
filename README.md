# Varun Sharma · Portfolio

My personal portfolio site: projects, skills and contact details.

## Edit the content

Everything shown on the site lives in [`src/profile.ts`](src/profile.ts). Change it and save; empty fields are
hidden. To add a resume, put it at `public/resume.pdf` and set `resume: "/resume.pdf"`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # production build in dist/
```

Locally, "Ask my AI" answers offline (there is no `/api` under Vite) and the GitHub section calls GitHub directly.

## Deploy

Import this repository at [vercel.com/new](https://vercel.com/new). Vercel detects Vite automatically, and the
functions in [`api/`](api) deploy with it. Every push to the main branch redeploys the site.

Optional environment variables (Vercel → Project → Settings → Environment Variables):

| Variable | What it does |
|---|---|
| `GEMINI_API_KEY` | Turns on AI answers in "Ask my AI" ([`api/ask.ts`](api/ask.ts)). Without it, answers come offline from the best-matching passage. |
| `GEMINI_MODEL` | Overrides the model (default `gemini-3.8-flash`). |
| `GITHUB_TOKEN` | Raises GitHub's rate limit for the "Now" section ([`api/github.ts`](api/github.ts)). Read-only, no scopes needed. |

Analytics: enable **Web Analytics** in the Vercel project to see visits.

## Where things live

- [`src/profile.ts`](src/profile.ts): all content, including projects and the "Now" list
- [`src/knowledge.ts`](src/knowledge.ts): what "Ask my AI" knows, built from `profile.ts`
- [`public/og.png`](public/og.png): the link-preview image
