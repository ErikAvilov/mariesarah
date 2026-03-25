import Image from "next/image";
import { Lang, translations } from "@/lib/translations";
import { socialLinks } from "@/lib/data";
import type { ActiveHeroHighlightPayload } from "@/lib/hero-highlights";
import { HeroClient, type HeroDisplayContent } from "@/components/hero-client";
import { isNextImageOptimizable } from "@/lib/next-image-src";

const FALLBACK_BG = "/images/portrait-test.png";

function resolveHeroContent(
  lang: Lang,
  highlight: ActiveHeroHighlightPayload | null
): HeroDisplayContent {
  const t = translations[lang];
  if (highlight) {
    return {
      eyebrow: highlight.eyebrow,
      title: highlight.title,
      artist_name: highlight.artist_name,
      cta_label: highlight.cta_label,
      target_url: highlight.target_url,
      background_image_url: highlight.background_image_url,
    };
  }
  return {
    eyebrow: "Nouveau single",
    title: "Can Feel It",
    artist_name: "Marie Sarah",
    cta_label: t.hero.listenNow,
    target_url: socialLinks.linktree,
    background_image_url: FALLBACK_BG,
  };
}

export function Hero({
  lang,
  highlight,
}: {
  lang: Lang;
  highlight: ActiveHeroHighlightPayload | null;
}) {
  const content = resolveHeroContent(lang, highlight);
  const alt =
    lang === "fr"
      ? `${content.artist_name} — ${content.title}, visuel du hero`
      : `${content.artist_name} — ${content.title}, hero visual`;

  const src = content.background_image_url;
  const useOptimizer = isNextImageOptimizable(src);

  return (
    <HeroClient highlight={highlight} content={content}>
      <div className="relative z-0 w-full h-screen sm:h-[600px] lg:h-screen">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={useOptimizer ? 80 : undefined}
          unoptimized={!useOptimizer}
          className="object-cover object-center"
        />
      </div>
    </HeroClient>
  );
}
