import Link from "next/link";
import { Lang, translations } from "@/lib/translations";
import { socialLinks } from "@/lib/data";

export function Hero({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
    >
      <div
          className="relative w-full h-screen sm:h-[600px] lg:h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/portrait-test.png)" }}
        />

      <div className="relative lg:absolute lg:bottom-12 lg:left-8 lg:bg-transparent z-20 w-full lg:w-auto font-montserrat">
        <div className="lg:hidden bg-secondary/95 px-6 py-8 sm:px-8 sm:py-10 border-t border-primary/20">
          <h1 className="font-bebas text-2xl sm:text-3xl font-bold text-secondary-foreground mb-2 tracking-[0.2em]">
            Marie Sarah
          </h1>
          <p className="text-sm font-medium uppercase tracking-widest text-secondary-foreground/70 mb-2">
            Nouveau single
          </p>
          <h2 className="text-lg sm:text-xl font-semibold uppercase tracking-widest text-secondary-foreground mb-4">
            Can Feel It
          </h2>
          <Link
            href={socialLinks.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium uppercase tracking-widest"
          >
            Écouter
            <span className="text-lg">→</span>
          </Link>
        </div>

        <div className="hidden lg:block text-white max-w-sm">
          <p className="text-xs font-medium uppercase tracking-widest text-white/60 mb-2">
            Nouveau single
          </p>
          <h2 className="text-base font-semibold uppercase tracking-widest text-white mb-6">
            Can Feel It
          </h2>
          <Link
            href={socialLinks.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white hover:text-white/70 transition-colors text-xs font-medium uppercase tracking-widest"
          >
            Écouter
            <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
