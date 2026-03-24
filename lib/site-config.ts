/**
 * URL publique du site (sans slash final, https, sans www).
 * Définir NEXT_PUBLIC_SITE_URL en production (ex. https://mariesarah.com).
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://mariesarah.com");
  try {
    const u = new URL(raw.trim().replace(/\/+$/, ""));
    if (u.protocol === "http:") u.protocol = "https:";
    let host = u.hostname;
    if (host.startsWith("www.")) host = host.slice(4);
    return `${u.protocol}//${host}${u.port ? `:${u.port}` : ""}`;
  } catch {
    let url = raw.trim().replace(/\/+$/, "");
    if (url.startsWith("http://")) url = `https://${url.slice(7)}`;
    return url;
  }
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
