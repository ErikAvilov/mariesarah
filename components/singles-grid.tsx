"use client";

import { useState, useCallback, useMemo } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SingleRow } from "@/lib/singles";
import { getYoutubeVideoId } from "@/lib/singles";
import {
  AdminCursorMenu,
  type AdminMenuAction,
} from "@/components/admin-cursor-menu";
import {
  ADMIN_EDIT_INSET_CLASS,
  cnAdminEditWrap,
} from "@/lib/admin-editable-hover";

/** Normalise un single (Supabase peut renvoyer snake_case ou camelCase selon le contexte) */
function normalizeSingle(s: SingleRow | Record<string, unknown>): SingleRow {
  const r = s as Record<string, unknown>;
  const id = String(r.id ?? (r as Record<string, unknown>).id ?? "");
  const title = String(r.title ?? (r as Record<string, unknown>).title ?? "");
  return {
    id,
    title: title || "Sans titre",
    youtube_url: String(r.youtube_url ?? (r as Record<string, unknown>).youtubeUrl ?? ""),
    image_url: String(r.image_url ?? (r as Record<string, unknown>).imageUrl ?? ""),
    display_order: Number(r.display_order ?? (r as Record<string, unknown>).displayOrder ?? 0),
    created_at: String(r.created_at ?? (r as Record<string, unknown>).createdAt ?? ""),
  };
}

interface SinglesGridProps {
  singles: SingleRow[];
  isAdmin?: boolean;
}

export function SinglesGrid({ singles, isAdmin = false }: SinglesGridProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [adminMenu, setAdminMenu] = useState<{
    x: number;
    y: number;
    single: SingleRow;
    videoId: string | null;
  } | null>(null);
  const normalized = singles
    .map(normalizeSingle)
    .filter((s) => s.id)
    .sort((a, b) => a.display_order - b.display_order);

  const isOddCount = normalized.length % 2 === 1;
  const mostRecent =
    isOddCount && normalized.length > 0 ? normalized[0] : null;
  const rest = mostRecent ? normalized.slice(1) : normalized;

  const handleCoverClick = useCallback((single: SingleRow) => {
    const videoId = getYoutubeVideoId(single.youtube_url);
    if (videoId) setPlayingId((prev) => (prev === single.id ? null : single.id));
  }, []);

  const adminMenuActions = useMemo((): AdminMenuAction[] => {
    if (!adminMenu) return [];
    const vid = adminMenu.videoId;
    const actions: AdminMenuAction[] = [
      {
        label: "Modifier le single",
        href: `/admin/singles/${adminMenu.single.id}/edit`,
      },
    ];
    if (vid) {
      actions.push({
        label: "Lire le clip",
        onClick: () => {
          setPlayingId((prev) =>
            prev === adminMenu.single.id ? null : adminMenu.single.id
          );
        },
      });
    }
    actions.push({ label: "Tous les singles", href: "/admin/singles" });
    return actions;
  }, [adminMenu]);

  if (normalized.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Inline player: when a single is selected, show YouTube embed (no modal) */}
      {playingId && (() => {
        const single = normalized.find((s) => s.id === playingId);
        const videoId = single ? getYoutubeVideoId(single.youtube_url) : null;
        if (!single || !videoId) return null;
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-border">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={`Clip « ${single.title} » — Marie Sarah`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
            <p className="text-center mt-2 text-sm font-medium text-foreground">
              {single.title}
            </p>
          </div>
        );
      })()}

      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8",
          "max-w-7xl mx-auto"
        )}
        role="list"
        aria-label="Singles de Marie Sarah"
      >
        {mostRecent && (() => {
          const single = mostRecent;
          const videoId = getYoutubeVideoId(single.youtube_url);
          return (
            <div className="col-span-2 flex justify-center items-center min-w-0">
              <div
                className={cn(
                  "w-full max-w-[min(100%,calc((100%-2rem)/2))]",
                  cnAdminEditWrap(isAdmin)
                )}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    if (isAdmin) {
                      e.preventDefault();
                      e.stopPropagation();
                      setAdminMenu({
                        x: e.clientX,
                        y: e.clientY,
                        single,
                        videoId: videoId ?? null,
                      });
                      return;
                    }
                    handleCoverClick(single);
                  }}
                  disabled={!isAdmin && !videoId}
                  className={cn(
                    "group relative aspect-square rounded-md overflow-hidden w-full",
                    "border border-border bg-card",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "transition-[box-shadow] duration-300 ease-out",
                    "hover:shadow-xl hover:shadow-black/15",
                    isAdmin && "cursor-pointer",
                    !isAdmin && videoId && "cursor-pointer",
                    !videoId && !isAdmin && "cursor-not-allowed opacity-80"
                  )}
                  style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}
                  aria-label={videoId ? `Lire ${single.title}` : single.title}
                >
                  <img
                    src={single.image_url || ""}
                    alt={`Marie Sarah — ${single.title}, pochette du single`}
                    loading="eager"
                    decoding="async"
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out origin-center",
                      "group-hover:scale-[1.05]"
                    )}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {isAdmin ? (
                    <span className={ADMIN_EDIT_INSET_CLASS} aria-hidden />
                  ) : null}
                  <span
                    className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 z-[2]"
                    aria-hidden
                  />
                  {videoId && (
                    <span
                      className={cn(
                        "absolute inset-0 z-[3] flex items-center justify-center transition-opacity duration-300",
                        "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <span className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary text-primary-foreground shadow-xl group-hover:bg-primary/90 group-hover:scale-105 transition-all duration-300">
                        <Play
                          className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-0.5"
                          aria-hidden
                        />
                      </span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })()}
        {rest.map((single) => {
          const videoId = getYoutubeVideoId(single.youtube_url);
          return (
            <div
              key={single.id}
              className={cn(
                "flex justify-center items-center min-w-0",
                cnAdminEditWrap(isAdmin)
              )}
            >
              <button
                type="button"
                onClick={(e) => {
                  if (isAdmin) {
                    e.preventDefault();
                    e.stopPropagation();
                    setAdminMenu({
                      x: e.clientX,
                      y: e.clientY,
                      single,
                      videoId: videoId ?? null,
                    });
                    return;
                  }
                  handleCoverClick(single);
                }}
                disabled={!isAdmin && !videoId}
                className={cn(
                  "group relative aspect-square rounded-md overflow-hidden w-full",
                  "border border-border bg-card",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "transition-[box-shadow] duration-300 ease-out",
                  "hover:shadow-xl hover:shadow-black/15",
                  isAdmin && "cursor-pointer",
                  !isAdmin && videoId && "cursor-pointer",
                  !videoId && !isAdmin && "cursor-not-allowed opacity-80"
                )}
                style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}
                aria-label={videoId ? `Lire ${single.title}` : single.title}
              >
                <img
                  src={single.image_url || ""}
                  alt={`Marie Sarah — ${single.title}, pochette du single`}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out origin-center",
                    "group-hover:scale-[1.05]"
                  )}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {isAdmin ? (
                  <span className={ADMIN_EDIT_INSET_CLASS} aria-hidden />
                ) : null}
                <span
                  className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 z-[2]"
                  aria-hidden
                />
                {videoId && (
                  <span
                    className={cn(
                      "absolute inset-0 z-[3] flex items-center justify-center transition-opacity duration-300",
                      "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <span className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary text-primary-foreground shadow-xl group-hover:bg-primary/90 group-hover:scale-105 transition-all duration-300">
                      <Play
                        className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-0.5"
                        aria-hidden
                      />
                    </span>
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {isAdmin ? (
        <AdminCursorMenu
          open={!!adminMenu}
          x={adminMenu?.x ?? 0}
          y={adminMenu?.y ?? 0}
          onClose={() => setAdminMenu(null)}
          actions={adminMenuActions}
        />
      ) : null}
    </div>
  );
}
