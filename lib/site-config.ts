/**
 * Origine publique unique pour canonical, metadataBase, Open Graph, sitemap et robots.
 * Ne pas utiliser VERCEL_URL ni l’hôte de la requête — évite *.vercel.app dans le SEO.
 */
const SITE_ORIGIN = "https://mariesarah.com";

export function getSiteUrl(): string {
  return SITE_ORIGIN;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
