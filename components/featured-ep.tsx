import Image from "next/image";
import Link from "next/link";
import { Lang, translations } from "@/lib/translations";
import { EP } from "@/lib/data";

interface FeaturedEPProps {
  ep: EP;
  lang: Lang;
}

export function FeaturedEP({ ep, lang }: FeaturedEPProps) {
  const t = translations[lang];

  return (
    <div className="mb-16 font-montserrat uppercase">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card border border-border rounded-lg overflow-hidden p-8">
        {/* Left: EP Cover */}
        <div className="flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-xs md:max-w-none">
            <Image
              src={ep.image}
              alt={ep.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Right: Info + Tracklist + CTA */}
        <div className="flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide mb-4">
              {t.music.premierEP}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">
              {ep.title}
            </h3>
            <p className="text-base text-muted-foreground mb-1 tracking-wide">
              {ep.artist} — EP ({ep.year})
            </p>
            <p className="text-xs text-muted-foreground mb-6 tracking-wide">{ep.genre}</p>
          </div>

          {/* Tracklist */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-foreground mb-3 tracking-wide">Tracks</h4>
            <ol className="space-y-2">
              {ep.tracks.map((track, index) => (
                <li
                  key={index}
                  className="flex items-center text-xs text-muted-foreground tracking-wide"
                >
                  <span className="font-medium text-primary mr-3">
                    {index + 1}.
                  </span>
                  <span>{track}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={ep.listenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold tracking-wide hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {t.music.listenEP}
            </Link>
            <Link
              href={ep.allLinksUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg text-sm font-semibold tracking-wide hover:border-primary hover:text-primary transition-colors"
            >
              {t.music.allLinks}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
