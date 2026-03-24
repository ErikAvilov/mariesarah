"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lang, translations } from "@/lib/data";
import { getConcerts, type ConcertRow } from "@/lib/concerts";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { InstagramIcon, FacebookIcon } from "@/components/Icons";
import { socialLinks } from "@/lib/data";

const ITEMS_PER_PAGE = 10;

export function ConcertsSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [currentPage, setCurrentPage] = useState(1);
  const [upcomingConcerts, setUpcomingConcerts] = useState<ConcertRow[]>([]);
  const [pastConcerts, setPastConcerts] = useState<ConcertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getConcerts()
      .then(({ upcoming, past }) => {
        setUpcomingConcerts(upcoming);
        setPastConcerts(past);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const page = parseInt(params.get("page") || "1", 10);
      if (page > 0) {
        setCurrentPage(page);
      }
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    window.history.replaceState({}, "", url);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isConcertUpcoming = (c: ConcertRow) => {
    const eventDate = new Date(c.event_date + "T00:00:00");
    return eventDate.getTime() >= today.getTime();
  };

  const allConcerts = [...upcomingConcerts, ...pastConcerts];

  const totalPages = Math.ceil(allConcerts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedConcerts = allConcerts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const pageHasUpcoming = paginatedConcerts.some(isConcertUpcoming);
  const pageHasPast = paginatedConcerts.some((c) => !isConcertUpcoming(c));

  const formatDate = (dateString: string, lang: Lang) => {
    const date = new Date(dateString + "T00:00:00");
    if (lang === "fr") {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <section id="tour" className="pt-8 pb-20 lg:pt-12 lg:pb-32 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-4xl sm:text-5xl font-bold uppercase text-foreground mb-4">
              {t.tour.title}
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto" />
          </div>
          <div className="text-center py-16 text-muted-foreground">
            {t.tour.followSocials}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tour" className="pt-8 pb-20 lg:pt-12 lg:pb-32 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          {isAdmin && (
            <Link
              href="/admin/concerts/new"
              className="absolute right-0 top-0 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-2xl font-semibold shadow-md hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
              aria-label="Ajouter un concert"
            >
              +
            </Link>
          )}
          <h2 className="font-bebas text-4xl sm:text-5xl font-bold uppercase text-foreground mb-4">
            {t.tour.title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        {allConcerts.length > 0 ? (
          <div className="space-y-12 min-h-[800px]">
            {pageHasUpcoming && (
              <div>
                <h3 className="font-bebas text-2xl font-semibold uppercase text-foreground mb-6 pb-2 border-b border-border">
                  {t.tour.upcoming}
                </h3>
                <div className="space-y-4">
                  {paginatedConcerts.map((concert) => {
                    if (!isConcertUpcoming(concert)) return null;
                    return (
                      <ConcertRow
                        key={concert.id}
                        concert={concert}
                        lang={lang}
                        formatDate={formatDate}
                        t={t}
                        isPast={false}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {pageHasPast && (
              <div>
                <h3 className="font-bebas text-2xl font-semibold uppercase text-foreground mb-6 pb-2 border-b border-border">
                  {t.tour.past}
                </h3>
                <div className="space-y-4">
                  {paginatedConcerts.map((concert) => {
                    if (isConcertUpcoming(concert)) return null;
                    return (
                      <ConcertRow
                        key={concert.id}
                        concert={concert}
                        lang={lang}
                        formatDate={formatDate}
                        t={t}
                        isPast={true}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-border">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm rounded-md border border-border text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted hover:border-muted-foreground/20 transition-colors"
                  aria-label="Previous page"
                >
                  ←
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "border border-border text-foreground hover:bg-muted hover:border-muted-foreground/20"
                        }`}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm rounded-md border border-border text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted hover:border-muted-foreground/20 transition-colors"
                  aria-label="Next page"
                >
                  →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              {t.tour.noPastDates}
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

interface ConcertRowProps {
  concert: ConcertRow;
  lang: Lang;
  formatDate: (date: string, lang: Lang) => string;
  t: (typeof translations)["fr"];
  isPast: boolean;
}

function ConcertRow({ concert, lang, formatDate, t, isPast }: ConcertRowProps) {
  const ticketButtonText = concert.ticket_label ?? t.tour.tickets;
  const showRight =
    !isPast &&
    (concert.ticket_url != null || concert.ticket_label != null);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-background rounded-lg border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="font-sans text-primary font-bold text-lg min-w-fit">
          {formatDate(concert.event_date, lang)}
        </div>
        <div className="font-sans">
          <div className="font-semibold text-foreground">
            {concert.city}, {concert.country}
          </div>
          <div className="text-muted-foreground">{concert.venue}</div>
        </div>
      </div>
      {showRight &&
        (concert.ticket_url ? (
          <Button
            asChild
            className="mt-4 sm:mt-0 font-sans bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link
              href={concert.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ticketButtonText}
            </Link>
          </Button>
        ) : (
          <span className="mt-4 sm:mt-0 text-sm uppercase tracking-widest text-muted-foreground font-medium">
            {concert.ticket_label}
          </span>
        ))}
    </div>
  );
}
