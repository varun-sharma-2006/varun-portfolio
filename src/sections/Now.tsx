import { useEffect, useState } from "react";
import { profile } from "../profile";
import { GH_USER, githubSummary, type GitHubData } from "../github";
import { External, SocialIcon } from "../components/icons";
import { SectionHead, Spotlight } from "../components/ui";
import { sectionNumber } from "../lib/site";

// GitHub's public events API only covers the last 30 days.
export const GH_DAYS = 30;

/** Cached copy from /api/github; straight from GitHub if that isn't available (e.g. local dev). */
export async function loadGitHub(): Promise<GitHubData> {
  const cacheKey = `gh:${GH_USER}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) ?? "null") as GitHubData | null;
    if (cached && Date.now() - cached.fetched < 30 * 60 * 1000) return cached;
  } catch {
    // storage unavailable
  }
  let data: GitHubData;
  try {
    const res = await fetch("/api/github");
    if (!res.ok || !res.headers.get("content-type")?.includes("json")) throw new Error(String(res.status));
    data = (await res.json()) as GitHubData;
  } catch {
    data = await githubSummary();
  }
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {
    // storage unavailable
  }
  return data;
}

export function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "a month ago" : `${months} months ago`;
}

export function ActivityBars({ days }: { days: Record<string, number> }) {
  // GitHub timestamps are UTC, so bars are UTC days, oldest on the left.
  const DAY = 86400000;
  const today = Math.floor(Date.now() / DAY) * DAY;
  const bars = Array.from({ length: GH_DAYS }, (_, i) => {
    const t = today - (GH_DAYS - 1 - i) * DAY;
    const key = new Date(t).toISOString().slice(0, 10);
    return { key, count: days[key] ?? 0, label: new Date(t).toLocaleDateString("en", { day: "numeric", month: "short", timeZone: "UTC" }) };
  });
  const max = Math.max(1, ...bars.map((b) => b.count));
  const total = bars.reduce((n, b) => n + b.count, 0);
  const active = bars.filter((b) => b.count > 0).length;
  return (
    <div className="bars-wrap">
      <div className="bars" role="img" aria-label={`${total} public GitHub events on ${active} of the last ${GH_DAYS} days`}>
        {bars.map((b) => (
          <span key={b.key} className={b.count ? "bar" : "bar empty"} title={`${b.label}: ${b.count} event${b.count === 1 ? "" : "s"}`}>
            <i style={{ height: b.count ? `${Math.max(10, (b.count / max) * 100)}%` : undefined }} />
          </span>
        ))}
      </div>
      <div className="bars-axis mono">
        <span>{bars[0].label}</span>
        <span>
          {total} events · {active} active days
        </span>
        <span>Today</span>
      </div>
    </div>
  );
}

export function Now() {
  const [gh, setGh] = useState<GitHubData | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    loadGitHub()
      .then((d) => alive && setGh(d))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="now" className="section">
      <SectionHead index={sectionNumber("now")} eyebrow="Now" title={<>What I'm <span className="grad">up to</span></>}>
        The latest, plus my public GitHub activity, pulled live.
      </SectionHead>
      <div className="now-grid">
        <Spotlight className="now-card">
          <span className="badge">
            <i />
            Updated {profile.nowUpdated}
          </span>
          <ul className="now-list">
            {profile.now.map((n) => (
              <li key={n.label}>
                <span className="mono">{n.label}</span>
                <p>{n.text}</p>
              </li>
            ))}
          </ul>
        </Spotlight>

        <Spotlight className="gh-card">
          <div className="gh-head">
            <span className="gh-logo" aria-hidden="true">
              <SocialIcon name="GitHub" />
            </span>
            <div>
              <strong>@{GH_USER}</strong>
              <span>{gh ? `${gh.repos} public repositories` : failed ? "Live data unavailable right now" : "Loading live data…"}</span>
            </div>
            <a className="link" href={profile.github} target="_blank" rel="noreferrer">
              Profile <External />
            </a>
          </div>
          {gh ? (
            <>
              <ActivityBars days={gh.days} />
              <ul className="gh-repos">
                {gh.recent.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noreferrer">
                      <strong>{r.name}</strong>
                      {r.description ? <span>{r.description}</span> : null}
                    </a>
                    <em className="mono">
                      {r.language ? <b>{r.language}</b> : null}
                      {timeAgo(r.pushed)}
                    </em>
                  </li>
                ))}
              </ul>
            </>
          ) : failed ? (
            <p className="gh-fail">
              GitHub's API didn't respond.{" "}
              <a href={profile.github} target="_blank" rel="noreferrer">
                See my activity on GitHub <External />
              </a>
            </p>
          ) : (
            <div className="gh-skeleton" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          )}
        </Spotlight>
      </div>
    </section>
  );
}
