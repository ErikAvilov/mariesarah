import Image from "next/image";
import Link from "next/link";
import { Lang, translations } from "@/lib/translations";
import type { PublicFeaturedAlbum } from "@/lib/albums";

interface FeaturedEPProps {
  album: PublicFeaturedAlbum;
  lang: Lang;
}

export function FeaturedEP({ album, lang }: FeaturedEPProps) {
  const t = translations[lang];
  const badgeText =
    album.badgeLabel.trim() !== "" ? album.badgeLabel : t.music.premierEP;

  return (
    <div className="mb-16 font-montserrat uppercase">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card border border-border rounded-lg overflow-hidden p-8">
        <div className="flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-xs md:max-w-none">
            <Image
              src={album.coverImageUrl}
              alt={album.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide mb-4">
              {badgeText}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">
              {album.title}
            </h3>
            <p className="text-base text-muted-foreground mb-1 tracking-wide">
              {album.artistName} — {album.releaseType} ({album.releaseYear})
            </p>
            <p className="text-xs text-muted-foreground mb-6 tracking-wide">{album.genre}</p>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-semibold text-foreground mb-3 tracking-wide">Tracks</h4>
            <ol className="space-y-2">
              {album.tracks.map((track, index) => (
                <li
                  key={`${track.trackNumber}-${index}`}
                  className="flex items-center text-xs text-muted-foreground tracking-wide"
                >
                  <span className="font-medium text-primary mr-3">{track.trackNumber}.</span>
                  <span>{track.title}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {album.primaryCtaUrl.trim() !== "" && (
              <Link
                href={album.primaryCtaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold tracking-wide hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {album.primaryCtaLabel.trim() !== ""
                  ? album.primaryCtaLabel
                  : t.music.listenEP}
              </Link>
            )}
            {album.secondaryCtaUrl.trim() !== "" && (
              <Link
                href={album.secondaryCtaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg text-sm font-semibold tracking-wide hover:border-primary hover:text-primary transition-colors"
              >
                {album.secondaryCtaLabel.trim() !== ""
                  ? album.secondaryCtaLabel
                  : t.music.allLinks}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
