import Link from "next/link";
import { Lang, translations } from "@/lib/translations";
import { socialLinks, tourDates } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { InstagramIcon, FacebookIcon } from "@/components/Icons";

export function TourSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return (
    <section id="tour" className="py-20 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-rockstar text-4xl sm:text-5xl font-bold uppercase text-foreground mb-4">
            {t.tour.title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        {tourDates.length > 0 ? (
          <div className="space-y-4">
            {tourDates.map((tour, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-background rounded-lg border border-border"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  <div className="text-primary font-bold text-lg">
                    {tour.date}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {tour.city}
                    </div>
                    <div className="text-muted-foreground">{tour.venue}</div>
                  </div>
                </div>
                {tour.soldOut ? (
                  <span className="mt-4 sm:mt-0 text-sm uppercase tracking-widest text-muted-foreground">
                    {t.tour.soldOut}
                  </span>
                ) : (
                  <Button
                    asChild
                    className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Link href={tour.ticketUrl || "#"} target="_blank" rel="noopener noreferrer">
                      {t.tour.tickets}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              {t.tour.noShows}
            </p>
            <p className="text-foreground/60">{t.tour.followSocials}</p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Link
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-[#E4405F]"
              >
                <InstagramIcon className="h-6 w-6" />
              </Link>
              <Link
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-[#1877F2]"
              >
                <FacebookIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
