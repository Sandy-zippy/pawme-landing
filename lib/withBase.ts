// Prefix asset paths with the configured basePath so they resolve correctly
// when the site is served from a subpath (e.g. /pawme-landing on github.io).
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:") || path.startsWith("mailto:")) return path;
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
