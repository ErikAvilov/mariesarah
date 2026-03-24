"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Lang, translations } from "@/lib/data";
import { getConcerts, type ConcertRow } from "@/lib/concerts";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { InstagramIcon, FacebookIcon } from "@/components/Icons";
import { socialLinks } from "@/lib/data";
import { AdminCursorMenu } from "@/components/admin-cursor-menu";
import { cnAdminEditSurface } from "@/lib/admin-editable-hover";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAST_PER_PAGE = 5;

/** Même gabarit que `ConcertListRow` (concert passé, sans bouton droit). */
const CONCERT_ROW_SHELL =
  "flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-background rounded-lg border border-border";

function PastConcertRowPlaceholder() {
  return (
    <div
      className={cn(
        CONCERT_ROW_SHELL,
        "pointer-events-none border-dashed border-muted-foreground/20 bg-muted/15"
      )}
      aria-hidden
    >
      <div className="invisible flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <div className="min-w-fit font-sans text-lg font-bold text-primary">
          31/12/2024
        </div>
        <div className="font-sans">
          <div className="font-semibold text-foreground">Ville, Pays</div>
          <div className="text-muted-foreground">Lieu du concert</div>
        </div>
      </div>
    </div>
  );
}

/** Numéros de page visibles avec ellipses si beaucoup de pages. */
function visiblePastPageSlots(
  current: number,
  total: number
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const set = new Set<number>();
  set.add(1);
  set.add(total);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) set.add(i);
  }
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1]! > 1) {
      out.push("ellipsis");
    }
    out.push(sorted[i]!);
  }
  return out;
}

export function ConcertsSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [pastPage, setPastPage] = useState(1);
  const [upcomingConcerts, setUpcomingConcerts] = useState<ConcertRow[]>([]);
  const [pastConcerts, setPastConcerts] = useState<ConcertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMenu, setAdminMenu] = useState<{
    x: number;
    y: number;
    concertId: string;
  } | null>(null);

  useEffect(() => {
    getConcerts()
      .then(({ upcoming, past }) => {
        setUpcomingConcerts(upcoming);
        setPastConcerts(past);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
  }, []);

  const totalPastPages = useMemo(() => {
    if (pastConcerts.length === 0) return 0;
    return Math.ceil(pastConcerts.length / PAST_PER_PAGE);
  }, [pastConcerts.length]);

  useEffect(() => {
    if (pastConcerts.length === 0) {
      setPastPage(1);
      return;
    }
    const tp = Math.ceil(pastConcerts.length / PAST_PER_PAGE);
    setPastPage((p) => Math.min(Math.max(1, p), tp));
  }, [pastConcerts.length]);

  const paginatedPast = useMemo(() => {
    if (pastConcerts.length === 0) return [];
    const start = (pastPage - 1) * PAST_PER_PAGE;
    return pastConcerts.slice(start, start + PAST_PER_PAGE);
  }, [pastConcerts, pastPage]);

  const pastRangeStart =
    pastConcerts.length === 0 ? 0 : (pastPage - 1) * PAST_PER_PAGE + 1;
  const pastRangeEnd = Math.min(pastPage * PAST_PER_PAGE, pastConcerts.length);

  const pastPageSlots =
    totalPastPages > 0 ? visiblePastPageSlots(pastPage, totalPastPages) : [];

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
              className="absolute right-0 top-0 z-10 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-2xl font-semibold shadow-md transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
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

        {upcomingConcerts.length > 0 || pastConcerts.length > 0 ? (
          <div className="space-y-12">
            {upcomingConcerts.length > 0 && (
              <div>
                <h3 className="font-bebas text-2xl font-semibold uppercase text-foreground mb-6 pb-2 border-b border-border">
                  {t.tour.upcoming}
                </h3>
                <div className="space-y-4">
                  {upcomingConcerts.map((concert) => (
                    <ConcertListRow
                      key={concert.id}
                      concert={concert}
                      lang={lang}
                      formatDate={formatDate}
                      t={t}
                      isPast={false}
                      isAdmin={isAdmin}
                      onAdminOpenMenu={(e, c) =>
                        setAdminMenu({
                          x: e.clientX,
                          y: e.clientY,
                          concertId: c.id,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {pastConcerts.length > 0 && (
              <div>
                <h3 className="font-bebas text-2xl font-semibold uppercase text-foreground mb-6 pb-2 border-b border-border">
                  {t.tour.past}
                </h3>
                <div className="space-y-4">
                  {paginatedPast.map((concert) => (
                    <ConcertListRow
                      key={concert.id}
                      concert={concert}
                      lang={lang}
                      formatDate={formatDate}
                      t={t}
                      isPast={true}
                      isAdmin={isAdmin}
                      onAdminOpenMenu={(e, c) =>
                        setAdminMenu({
                          x: e.clientX,
                          y: e.clientY,
                          concertId: c.id,
                        })
                      }
                    />
                  ))}
                  {totalPastPages > 1
                    ? Array.from({
                        length: Math.max(
                          0,
                          PAST_PER_PAGE - paginatedPast.length
                        ),
                      }).map((_, i) => (
                        <PastConcertRowPlaceholder
                          key={`past-empty-${pastPage}-${i}`}
                        />
                      ))
                    : null}
                </div>

                {totalPastPages > 1 && (
                  <nav
                    className="mt-10 pt-8 border-t border-border"
                    aria-label={t.tour.pastPaginationAria}
                  >
                    <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="order-2 text-center text-sm leading-snug text-muted-foreground sm:order-1 sm:max-w-[min(100%,20rem)] sm:flex-1 sm:text-left">
                        {t.tour.pastPaginationRange
                          .replace("{start}", String(pastRangeStart))
                          .replace("{end}", String(pastRangeEnd))
                          .replace("{total}", String(pastConcerts.length))}
                      </p>
                      <div className="order-1 flex flex-wrap items-center justify-center gap-2 sm:order-2 sm:shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setPastPage((p) => Math.max(1, p - 1))
                          }
                          disabled={pastPage <= 1}
                          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40 sm:px-4"
                          aria-label={t.tour.pastPaginationPrev}
                        >
                          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
                          <span className="hidden sm:inline">
                            {t.tour.pastPaginationPrev}
                          </span>
                        </button>
                        <div className="flex items-center justify-center gap-1">
                          {pastPageSlots.map((slot, idx) =>
                            slot === "ellipsis" ? (
                              <span
                                key={`e-${idx}`}
                                className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
                                aria-hidden
                              >
                                …
                              </span>
                            ) : (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setPastPage(slot)}
                                className={cn(
                                  "flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                                  pastPage === slot
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "border border-transparent text-foreground hover:bg-muted hover:border-border"
                                )}
                                aria-label={t.tour.pastPaginationPage
                                  .replace("{current}", String(slot))
                                  .replace("{total}", String(totalPastPages))}
                                aria-current={pastPage === slot ? "page" : undefined}
                              >
                                {slot}
                              </button>
                            )
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPastPage((p) =>
                              Math.min(totalPastPages, p + 1)
                            )
                          }
                          disabled={pastPage >= totalPastPages}
                          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40 sm:px-4"
                          aria-label={t.tour.pastPaginationNext}
                        >
                          <span className="hidden sm:inline">
                            {t.tour.pastPaginationNext}
                          </span>
                          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </nav>
                )}
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

        {isAdmin ? (
          <AdminCursorMenu
            open={!!adminMenu}
            x={adminMenu?.x ?? 0}
            y={adminMenu?.y ?? 0}
            onClose={() => setAdminMenu(null)}
            actions={
              adminMenu
                ? [
                    {
                      label: "Modifier ce concert",
                      href: `/admin/concerts/${adminMenu.concertId}/edit`,
                    },
                    { label: "Tous les concerts", href: "/admin/concerts" },
                    { label: "Nouveau concert", href: "/admin/concerts/new" },
                  ]
                : []
            }
          />
        ) : null}
      </div>
    </section>
  );
}

interface ConcertListRowProps {
  concert: ConcertRow;
  lang: Lang;
  formatDate: (date: string, lang: Lang) => string;
  t: (typeof translations)["fr"];
  isPast: boolean;
  isAdmin?: boolean;
  onAdminOpenMenu?: (e: React.MouseEvent, concert: ConcertRow) => void;
}

function ConcertListRow({
  concert,
  lang,
  formatDate,
  t,
  isPast,
  isAdmin = false,
  onAdminOpenMenu,
}: ConcertListRowProps) {
  const ticketButtonText = concert.ticket_label ?? t.tour.tickets;
  const showRight =
    !isPast &&
    (concert.ticket_url != null || concert.ticket_label != null);

  return (
    <div
      className={cn(
        CONCERT_ROW_SHELL,
        cnAdminEditSurface(isAdmin)
      )}
      onClick={
        isAdmin && onAdminOpenMenu
          ? (e) => {
              if ((e.target as HTMLElement).closest("a, button")) return;
              onAdminOpenMenu(e, concert);
            }
          : undefined
      }
    >
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
              onClick={(e) => e.stopPropagation()}
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
