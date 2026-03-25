/** True si `next/image` peut passer par l’optimiseur (domaines autorisés dans next.config). */
export function isNextImageOptimizable(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    const hostname = new URL(src).hostname;
    return hostname === "localhost" || hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}
