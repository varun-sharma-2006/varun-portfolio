/**
 * Live GitHub activity for the "Now" section, fetched server-side and cached at Vercel's edge for 30 minutes,
 * so visitors never hit GitHub's 60-requests-per-hour limit for unauthenticated calls (e.g. a whole campus
 * sharing one IP). Set GITHUB_TOKEN in Vercel to raise the limit further; it is optional.
 */
import { githubSummary } from "../src/github";

export const config = { runtime: "edge" };

declare const process: { env: Record<string, string | undefined> };

export default async function handler(): Promise<Response> {
  try {
    const data = await githubSummary(process.env.GITHUB_TOKEN);
    return new Response(JSON.stringify(data), {
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 502, headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
}
