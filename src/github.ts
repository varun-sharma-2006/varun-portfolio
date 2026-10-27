/** Public GitHub activity, summarised. Runs in the edge function (cached) and, as a fallback, in the browser. */
import { profile } from "./profile";

export const GH_USER = profile.github.replace(/\/+$/, "").split("/").pop() ?? "";

export interface GitHubData {
  repos: number;
  recent: { name: string; description: string; language: string | null; pushed: string; url: string }[];
  days: Record<string, number>; // UTC date (YYYY-MM-DD) -> public events that day
  fetched: number;
}

export async function githubSummary(token?: string): Promise<GitHubData> {
  const headers: Record<string, string> = { accept: "application/vnd.github+json", "user-agent": "varun-portfolio" };
  if (token) headers.authorization = `Bearer ${token}`;
  const api = (path: string) =>
    fetch(`https://api.github.com/${path}`, { headers }).then((r) => {
      if (!r.ok) throw new Error(`GitHub ${r.status}`);
      return r.json();
    });

  const [user, repos, ...pages] = await Promise.all([
    api(`users/${GH_USER}`),
    api(`users/${GH_USER}/repos?sort=pushed&per_page=10`),
    // Public events go back about 90 days, 100 per page.
    ...[1, 2, 3].map((page) => api(`users/${GH_USER}/events/public?per_page=100&page=${page}`).catch(() => [])),
  ]);

  const days: Record<string, number> = {};
  for (const e of pages.flat() as { created_at: string }[]) {
    const d = e.created_at.slice(0, 10);
    days[d] = (days[d] ?? 0) + 1;
  }

  return {
    repos: user.public_repos ?? 0,
    recent: (repos as { name: string; description: string | null; language: string | null; pushed_at: string; html_url: string; fork: boolean }[])
      .filter((r) => !r.fork && r.name !== `${GH_USER}.github.io`)
      .slice(0, 5)
      .map((r) => ({
        name: r.name.replace(/-+$/, "").replace(/-/g, " "),
        description: r.description ?? "",
        language: r.language,
        pushed: r.pushed_at,
        url: r.html_url,
      })),
    days,
    fetched: Date.now(),
  };
}
