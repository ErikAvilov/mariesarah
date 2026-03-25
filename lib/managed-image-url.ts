/**
 * URLs d’images gérées par ce site : fichiers locaux (dev) ou bucket Supabase Storage (prod).
 * Utilisé côté client pour savoir si on peut demander une suppression après remplacement.
 */
export function isManagedImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.includes("..")) return false;
  if (url.startsWith("/images/")) return true;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return false;

  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || "site-uploads";
  const prefix = `${base}/storage/v1/object/public/${bucket}/`;
  return url.startsWith(prefix);
}
