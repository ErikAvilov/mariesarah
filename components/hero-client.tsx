"use client";

import { useState, useEffect, useMemo, type ReactNode } from "react";
import Link from "next/link";
import type { ActiveHeroHighlightPayload } from "@/lib/hero-highlights";
import { supabase } from "@/lib/supabase";
import { AdminCursorMenu, type AdminMenuAction } from "@/components/admin-cursor-menu";
import { cnAdminEditHeroOverlay } from "@/lib/admin-editable-hover";
import { cn } from "@/lib/utils";

export type HeroDisplayContent = {
  eyebrow: string;
  title: string;
  artist_name: string;
  cta_label: string;
  target_url: string;
  background_image_url: string;
};

export function HeroClient({
  children,
  highlight,
  content,
}: {
  children: ReactNode;
  highlight: ActiveHeroHighlightPayload | null;
  content: HeroDisplayContent;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
  }, []);

  const openInNewTab = /^https?:\/\//i.test(content.target_url);

  const heroMenuActions = useMemo((): AdminMenuAction[] => {
    const id = highlight?.id;
    const actions: AdminMenuAction[] = [];
    if (id) {
      actions.push({
        label: "Modifier le bloc hero",
        href: `/admin/hero-highlights/${id}/edit`,
      });
    }
    actions.push(
      { label: "Liste des blocs hero", href: "/admin/hero-highlights" },
      { label: "Nouveau bloc hero", href: "/admin/hero-highlights/new" }
    );
    return actions;
  }, [highlight?.id]);

  return (
    <div className="relative w-full">
      <section
        id="home"
        className={cn(
          "group/hero relative w-full overflow-hidden",
          isAdmin && "cursor-pointer"
        )}
        onClick={
          isAdmin
            ? (e) => {
                if ((e.target as HTMLElement).closest("a")) return;
                setMenu({ x: e.clientX, y: e.clientY });
              }
            : undefined
        }
      >
        {children}
        {isAdmin ? (
          <div className={cnAdminEditHeroOverlay()} aria-hidden />
        ) : null}

        <div className="relative lg:absolute lg:bottom-12 lg:left-8 lg:bg-transparent z-20 w-full lg:w-auto font-montserrat">
          <h1 className="sr-only">
            {`${content.artist_name} — ${content.title}. ${content.eyebrow}. Chanteuse soul, Paris — site officiel.`}
          </h1>
          <div className="lg:hidden bg-secondary/95 px-6 py-8 sm:px-8 sm:py-10 border-t border-primary/20">
            <p className="font-bebas text-2xl sm:text-3xl font-bold text-secondary-foreground mb-2 tracking-[0.2em]">
              {content.artist_name}
            </p>
            <p className="text-sm font-medium uppercase tracking-widest text-secondary-foreground/70 mb-2">
              {content.eyebrow}
            </p>
            <h2 className="text-lg sm:text-xl font-semibold uppercase tracking-widest text-secondary-foreground mb-4">
              {content.title}
            </h2>
            <Link
              href={content.target_url}
              {...(openInNewTab
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium uppercase tracking-widest"
            >
              {content.cta_label}
              <span className="text-lg">→</span>
            </Link>
          </div>

          <div className="hidden lg:block text-white max-w-sm">
            <p className="text-xs font-medium uppercase tracking-widest text-white/60 mb-2">
              {content.eyebrow}
            </p>
            <h2 className="text-base font-semibold uppercase tracking-widest text-white mb-2">
              {content.title}
            </h2>
            <p className="text-xs font-medium uppercase tracking-widest text-white/70 mb-6">
              {content.artist_name}
            </p>
            <Link
              href={content.target_url}
              {...(openInNewTab
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-white hover:text-white/70 transition-colors text-xs font-medium uppercase tracking-widest"
            >
              {content.cta_label}
              <span className="text-sm">→</span>
            </Link>
          </div>
        </div>
      </section>

      {isAdmin ? (
        <AdminCursorMenu
          open={!!menu}
          x={menu?.x ?? 0}
          y={menu?.y ?? 0}
          onClose={() => setMenu(null)}
          actions={heroMenuActions}
        />
      ) : null}
    </div>
  );
}
