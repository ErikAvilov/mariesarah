"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lang, translations } from "@/lib/translations";
import {
  SpotifyIcon,
  AppleMusicIcon,
  DeezerIcon,
  YouTubeIcon,
} from "@/components/Icons";
import { socialLinks } from "@/lib/data";
import { FeaturedEP } from "@/components/featured-ep";
import { SinglesGrid } from "@/components/singles-grid";
import { AdminCursorMenu } from "@/components/admin-cursor-menu";
import { cnAdminEditSurface } from "@/lib/admin-editable-hover";
import { supabase } from "@/lib/supabase";
import type { SingleRow } from "@/lib/singles";
import type { PublicFeaturedAlbum } from "@/lib/albums";
import { cn } from "@/lib/utils";

export function MusicSection({
  lang,
  singles,
  featuredAlbum,
}: {
  lang: Lang;
  singles: SingleRow[];
  featuredAlbum: PublicFeaturedAlbum | null;
}) {
  const t = translations[lang];
  const [isAdmin, setIsAdmin] = useState(false);
  const [emptyAlbumMenu, setEmptyAlbumMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
  }, []);

  return (
    <section id="music" className="pt-20 pb-8 lg:pt-32 lg:pb-12 bg-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bebas text-4xl sm:text-5xl font-bold uppercase text-foreground mb-4">
            {t.music.title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        <div className={cn("relative", !featuredAlbum && "mb-16")}>
          {isAdmin && (
            <Link
              href="/admin/albums"
              className="absolute right-0 top-0 z-10 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-foreground text-xl font-semibold shadow-md transition-all hover:bg-muted hover:scale-105 active:scale-95"
              aria-label="Gérer les albums"
              title="Albums"
            >
              +
            </Link>
          )}
          {featuredAlbum ? (
            <FeaturedEP album={featuredAlbum} lang={lang} isAdmin={isAdmin} />
          ) : isAdmin ? (
            <button
              type="button"
              className={cn(
                "mb-16 w-full rounded-xl border-2 border-dashed border-primary/35 bg-card/40 px-8 py-14 text-center",
                cnAdminEditSurface(true)
              )}
              onClick={(e) =>
                setEmptyAlbumMenu({ x: e.clientX, y: e.clientY })
              }
            >
              <p className="font-montserrat text-sm font-semibold uppercase tracking-widest text-foreground">
                Aucun album mis en avant
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Cliquez pour gérer ou créer un album
              </p>
            </button>
          ) : null}
        </div>

        <div className="text-center mb-12 relative">
          {isAdmin && (
            <Link
              href="/admin/singles/new"
              className="absolute right-0 top-0 z-10 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-2xl font-semibold shadow-md transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
              aria-label="Ajouter un single"
            >
              +
            </Link>
          )}
          <h3 className="font-bebas text-4xl sm:text-5xl font-bold uppercase text-foreground mb-4">
            {t.music.singles}
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        {singles.length > 0 && (
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-visible">
            <SinglesGrid singles={singles} isAdmin={isAdmin} />
          </div>
        )}

        {isAdmin ? (
          <AdminCursorMenu
            open={!!emptyAlbumMenu}
            x={emptyAlbumMenu?.x ?? 0}
            y={emptyAlbumMenu?.y ?? 0}
            onClose={() => setEmptyAlbumMenu(null)}
            actions={[
              { label: "Albums (liste)", href: "/admin/albums" },
              { label: "Nouvel album", href: "/admin/albums/new" },
            ]}
          />
        ) : null}

        <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
          <Link
            href={socialLinks.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-[#1DB954] hover:text-[#1DB954] transition-colors"
          >
            <SpotifyIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Spotify</span>
          </Link>
          <Link
            href={socialLinks.apple}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-[#FA243C] hover:text-[#FA243C] transition-colors"
          >
            <AppleMusicIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Apple Music</span>
          </Link>
          <Link
            href={socialLinks.deezer}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-[#FEAA2D] hover:text-[#FEAA2D] transition-colors"
          >
            <DeezerIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Deezer</span>
          </Link>
          <Link
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-[#FF0000] hover:text-[#FF0000] transition-colors"
          >
            <YouTubeIcon className="h-5 w-5" />
            <span className="text-sm font-medium">YouTube</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
