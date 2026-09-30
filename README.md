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

## Deploy

Import this repository at [vercel.com/new](https://vercel.com/new). Vercel detects Vite automatically; no settings
are needed. Every push to the main branch redeploys the site.
