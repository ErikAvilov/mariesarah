import { isManagedMediaUrl } from "@/lib/storage-media";

/**
 * Images gérées par le site : anciennes locales `/images/…` ou bucket Supabase `media`.
 */
export function isManagedImageUrl(url: string | null | undefined): boolean {
  if (!url || url.includes("..")) return false;
  if (url.startsWith("/images/")) return true;
  return isManagedMediaUrl(url);
}
