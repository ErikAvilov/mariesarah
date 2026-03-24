import Link from "next/link";
import { Lang, translations } from "@/lib/translations";
import { socialLinks } from "@/lib/data";
import type { ActiveHeroHighlightPayload } from "@/lib/hero-highlights";

const FALLBACK_BG = "/images/portrait-test.png";

export function Hero({
  lang,
  highlight,
}: {
  lang: Lang;
  highlight: ActiveHeroHighlightPayload | null;
}) {
  const t = translations[lang];

  const content = highlight ?? {
    eyebrow: "Nouveau single",
    title: "Can Feel It",
    artist_name: "Marie Sarah",
    cta_label: t.hero.listenNow,
    target_url: socialLinks.linktree,
    background_image_url: FALLBACK_BG,
  };

  const openInNewTab = /^https?:\/\//i.test(content.target_url);

  return (
    <section id="home" className="relative w-full overflow-hidden">
      <div
        className="relative w-full h-screen sm:h-[600px] lg:h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${content.background_image_url})` }}
      />

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
            className="inline-flex items-center gap-2 text-white hover:text-white/70 transition-colors text-xs font-medium uppercase tracking-widest"
          >
            {content.cta_label}
            <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
