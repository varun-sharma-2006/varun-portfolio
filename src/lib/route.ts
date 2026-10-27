import { projects } from "../profile";

export type Route = { page: "home" } | { page: "project"; id: string } | { page: "missing" };

/** "/" is the one-page portfolio, "/projects/<id>" a single project; anything else is a 404. */
export function parseRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/index.html") return { page: "home" };
  const m = path.match(/^\/projects\/([a-z0-9-]+)(?:\.html)?$/);
  if (m && projects.some((p) => p.id === m[1])) return { page: "project", id: m[1] };
  return { page: "missing" };
}
