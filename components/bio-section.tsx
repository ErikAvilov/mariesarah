import Image from "next/image";
import { Lang, translations } from "@/lib/translations";

export function BioSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return (
    <section
      id="bio"
      className="py-20 lg:py-32 bg-[#0F0F0F] text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
            <Image
              src="/images/portrait.jpg"
              loading="lazy"
              alt="Marie Sarah"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </div>

          <div>
            <h2 className="font-bebas text-4xl sm:text-5xl font-bold uppercase mb-4">
              {t.bio.title}
            </h2>
            <div className="w-16 h-1 bg-primary mb-8" />

            <blockquote className="text-xl sm:text-2xl font-serif italic text-white/85 mb-8 border-l-4 border-primary pl-6">
              {t.bio.sealQuote}
              <cite className="block mt-2 text-base not-italic text-primary font-sans font-semibold">
                {t.bio.sealAttrib}
              </cite>
            </blockquote>

            {lang === "fr" ? (
              <div className="space-y-4 text-white/85 leading-relaxed">
                <p>
                  Issue d'une maman française et d'un papa camerounais, Marie Sarah a 25 ans et a
                  grandi avec la télévision branchée en permanence sur les chaînes de clips.
                  À la maison, c'était comédie musicale non-stop.
                </p>

                <p>
                  La révélation : <em>Dreamgirls</em>, le film sur Diana Ross et les Supremes.
                  Dès lors, les sons feutrés, les cuivres, les crooners et la soul brute des
                  années 60 deviennent sa passion : Otis Redding, Etta James, Motown, Stax,
                  Chess Records.
                </p>

                <p>
                  Après une formation au Cours Florent en comédie musicale, Marie Sarah est
                  repérée suite à la mise en ligne d'une reprise d'Etta James,
                  « I'd Rather Go Blind ». Depuis la sortie de son premier EP en avril 2024
                  (+1,4 M de streams sur Spotify), elle est passée sur Taratata, a assuré les
                  premières parties de Boyz II Men, Gavin DeGraw et Tower of Power, et a
                  accompagné Seal sur six Zéniths en France.
                </p>
                <p className="font-semibold text-white">
                  Son premier album « On My Way » sort le 13 mars 2026.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-white/85 leading-relaxed">
                <p>
                  Born 25 years ago to a French mother and Cameroonian father,
                  Marie Sarah grew up in a home where the TV was always tuned to
                  music video channels. It was a constant musical comedy at
                  home.
                </p>
                <p>
                  The revelation came with <em>Dreamgirls</em>—the film about
                  Diana Ross and The Supremes. From that moment, velvet sounds,
                  brass sections, crooners, and the raw soul of the 60s became
                  her passion: Otis Redding, Etta James, Motown, Stax, Chess
                  Records.
                </p>
                <p>
                  After training at Cours Florent in musical theatre, Marie
                  Sarah was discovered after posting a cover of Etta
                  James&apos; &ldquo;I&apos;d Rather Go Blind.&rdquo; Since
                  releasing her debut EP in April 2024 (1.4M+ Spotify streams),
                  she has appeared on Taratata, opened for Boyz II Men, Gavin
                  DeGraw, Tower of Power, and toured with Seal across 6 French
                  Zeniths.
                </p>
                <p className="font-semibold text-white">
                  Her debut album &ldquo;On My Way&rdquo; arrives March 14,
                  2026.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
