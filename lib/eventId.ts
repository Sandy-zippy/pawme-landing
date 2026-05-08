// Browser-side helpers for Meta Pixel ↔ CAPI dedup.

/** Generate a deterministic-ish event id used by both browser fbq() and the
 * server-side CAPI event so Meta deduplicates them. */
export function generateEventId(prefix: string): string {
  const rand = (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
    : Math.random().toString(36).slice(2, 14);
  return `${prefix}_${Date.now()}_${rand}`;
}

/** Read the Meta browser id (`_fbp`) cookie. */
export function readFbp(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/_fbp=([^;]+)/);
  return m ? m[1] : "";
}

/** Read the Meta click id (`_fbc`) cookie or build one from `?fbclid=` if present. */
export function readFbc(): string {
  if (typeof document === "undefined") return "";
  const cookieMatch = document.cookie.match(/_fbc=([^;]+)/);
  if (cookieMatch) return cookieMatch[1];

  // Fall back to building one from the URL on first paint (Meta's spec)
  try {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) return `fb.1.${Date.now()}.${fbclid}`;
  } catch {}
  return "";
}

export function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    // Persisted UTMs from Tracking.tsx, falls back to current URL params
    const stored = JSON.parse(localStorage.getItem("pawme_utm") || "{}");
    if (Object.keys(stored).length) return stored;
    const params = new URLSearchParams(window.location.search);
    const out: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach((k) => {
      const v = params.get(k);
      if (v) out[k] = v;
    });
    return out;
  } catch {
    return {};
  }
}
