import { cn } from "@/lib/utils";

/**
 * Wrapper hors zone overflow:hidden : léger décalage pour que l’anneau soit **autour** du bloc, pas sur l’image.
 */
export function cnAdminEditWrap(isAdmin: boolean) {
  return cn(
    isAdmin &&
      "cursor-pointer rounded-[10px] p-[3px] ring-2 ring-transparent transition-[box-shadow,ring] duration-200 ease-out hover:ring-primary hover:shadow-[0_0_40px_hsl(var(--primary)/0.55),0_0_80px_hsl(var(--primary)/0.2)]"
  );
}

/** Classes du voile admin au survol du hero (à n’afficher que si `isAdmin`). */
export function cnAdminEditHeroOverlay() {
  return cn(
    "pointer-events-none absolute inset-0 z-[12] transition-[background-color,box-shadow] duration-200 ease-out",
    "shadow-[inset_0_0_0_2px_transparent] group-hover/hero:shadow-[inset_0_0_0_2px_hsl(var(--primary))] group-hover/hero:bg-primary/22"
  );
}

/** Surbrillance intérieure sur les pochettes singles (admin). */
export const ADMIN_EDIT_INSET_CLASS =
  "pointer-events-none absolute inset-0 z-[1] rounded-md shadow-[inset_0_0_0_2px_transparent] transition-[background-color,box-shadow] duration-200 ease-out group-hover:shadow-[inset_0_0_0_2px_hsl(var(--primary))] group-hover:bg-primary/25";

/**
 * Bloc pleine largeur / carte (album, concert, presse) sans overflow sur le root.
 */
export function cnAdminEditSurface(isAdmin: boolean) {
  return cn(
    isAdmin &&
      "cursor-pointer ring-2 ring-transparent transition-[box-shadow,ring,border-color] duration-200 ease-out hover:border-primary/80 hover:ring-primary hover:shadow-[0_0_36px_hsl(var(--primary)/0.5),0_0_72px_hsl(var(--primary)/0.18)]"
  );
}
