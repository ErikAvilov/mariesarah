"use client";

import Link from "next/link";
import { Lang, translations } from "@/lib/translations";
import {
  SpotifyIcon,
  AppleMusicIcon,
  DeezerIcon,
  YouTubeIcon,
} from "@/components/Icons";
import { socialLinks, featuredEP } from "@/lib/data";
import { FeaturedEP } from "@/components/featured-ep";
import { SinglesGrid } from "@/components/singles-grid";
import type { SingleRow } from "@/lib/singles";

export function MusicSection({
  lang,
  singles,
}: {
  lang: Lang;
  singles: SingleRow[];
}) {
  const t = translations[lang];

  return (
    <section id="music" className="pt-20 pb-8 lg:pt-32 lg:pb-12 bg-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bebas text-4xl sm:text-5xl font-bold uppercase text-foreground mb-4">
            {t.music.title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        <FeaturedEP ep={featuredEP} lang={lang} />

        <div className="text-center mb-12">
          <h3 className="font-bebas text-4xl sm:text-5xl font-bold uppercase text-foreground mb-4">
            {t.music.singles}
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        {singles.length > 0 && (
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-visible">
            <SinglesGrid singles={singles} />
          </div>
        )}

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
