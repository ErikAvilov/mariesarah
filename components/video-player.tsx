"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

const ARTIST_LABEL = "MARIE SARAH";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  image: string;
  featured?: boolean;
  onSelect?: () => void;
  autoPlay?: boolean;
}

export function VideoPlayer({
  videoId,
  title,
  image,
  featured = false,
  onSelect,
  autoPlay = false,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.05, rootMargin: "50px" }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (autoPlay) setIsPlaying(true);
  }, [autoPlay]);

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      setIsPlaying(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full aspect-video bg-muted overflow-hidden group",
        "rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isPlaying ? (
        <>
          {isInView && (
            <Image
              src={image}
              alt={title}
              fill
              className={cn(
                "object-cover transition-transform duration-500 ease-out",
                isHovered && "scale-105"
              )}
              priority={featured}
              sizes={featured ? "100vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            />
          )}
          {!isInView && (
            <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden />
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"
            aria-hidden
          />
          <div
            className={cn(
              "absolute inset-0 bg-primary/0 pointer-events-none transition-colors duration-300",
              isHovered && "bg-primary/5"
            )}
            aria-hidden
          />

          <button
            onClick={handleClick}
            className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
            aria-label={onSelect ? `Afficher : ${title}` : `Lire la vidéo : ${title}`}
            type="button"
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-full bg-black/50 text-white transition-all duration-300",
                "hover:bg-black/70 hover:scale-110 active:scale-95",
                featured
                  ? "w-14 h-14 sm:w-16 sm:h-16"
                  : "w-11 h-11 sm:w-12 sm:h-12"
              )}
            >
              <Play
                className={cn(
                  "fill-current text-white ml-0.5",
                  featured ? "h-5 w-5 sm:h-6 sm:w-6" : "h-4 w-4 sm:h-5 sm:w-5"
                )}
              />
            </span>
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 pointer-events-none">
            <p
              className={cn(
                "font-sans text-white/95 drop-shadow-md",
                "text-[10px] sm:text-xs uppercase tracking-[0.2em]",
                featured ? "font-medium" : "font-normal"
              )}
            >
              {ARTIST_LABEL} — {title.toUpperCase()}
            </p>
          </div>
        </>
      ) : (
        isInView && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        )
      )}
    </div>
  );
}
