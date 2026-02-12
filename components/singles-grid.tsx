"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Video } from "@/lib/data";

interface SinglesGridProps {
  videos: Video[];
}

export function SinglesGrid({ videos }: SinglesGridProps) {
  const [modalVideo, setModalVideo] = useState<Video | null>(null);

  const handleCoverClick = useCallback((video: Video) => {
    setModalVideo(video);
  }, []);

  const isOddCount = videos.length % 2 === 1;

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8",
          "max-w-7xl mx-auto"
        )}
        role="list"
        aria-label="Singles"
      >
        {videos.map((video, index) => {
          const isLastAndOdd = isOddCount && index === videos.length - 1;
          return (
            <div
              key={video.id}
              className={cn(
                "flex justify-center items-center min-w-0",
                isLastAndOdd && "col-span-2 justify-self-center"
              )}
              style={isLastAndOdd ? { maxWidth: "calc((100% - 2rem) / 2)" } : undefined}
            >
              <button
                type="button"
                onClick={() => handleCoverClick(video)}
                className={cn(
                  "group relative aspect-square rounded-md overflow-hidden cursor-pointer w-full",
                  "border border-border bg-card",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "transition-shadow duration-300 ease-out",
                  "hover:shadow-xl hover:shadow-black/15",
                  "singles-cover-btn"
                )}
                style={{
                  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                }}
                aria-label={`Ouvrir ${video.title}`}
              >
                <Image
                  src={video.image}
                  alt=""
                  fill
                  className={cn(
                    "object-cover transition-transform duration-300 ease-out origin-center will-change-transform",
                    "group-hover:scale-[1.05]"
                  )}
                  sizes="(max-width: 639px) 50vw, (max-width: 1279px) 45vw, 640px"
                />
                <span
                  className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
                  aria-hidden
                />
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                    "opacity-0 group-hover:opacity-100"
                  )}
                >
                  <span className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary text-primary-foreground shadow-xl group-hover:bg-primary/90 group-hover:scale-105 transition-all duration-300">
                    <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-0.5" aria-hidden />
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <Dialog open={!!modalVideo} onOpenChange={(open) => !open && setModalVideo(null)}>
        <DialogContent
          className="sm:max-w-3xl p-0 gap-0 overflow-hidden border-0"
          showCloseButton={true}
        >
          {modalVideo && (
            <>
              <DialogTitle className="sr-only">{modalVideo.title}</DialogTitle>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${modalVideo.id}?autoplay=1&rel=0`}
                  title={modalVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
              <p className="text-center py-3 px-4 text-sm font-medium text-foreground bg-card">
                {modalVideo.title}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
