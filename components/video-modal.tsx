"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface VideoModalProps {
  isOpen: boolean;
  videoId: string;
  title: string;
  onClose: () => void;
}

export function VideoModal({
  isOpen,
  videoId,
  title,
  onClose,
}: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus close button for accessibility
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on outside click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === modalRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="video-modal-title"
    >
      <div className="w-full max-w-4xl">
        {/* Header with title and close button */}
        <div className="flex items-center justify-between mb-4">
          <h2 id="video-modal-title" className="text-lg md:text-xl font-semibold text-foreground">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
            aria-label="Close video"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Video container with 16:9 aspect ratio */}
        <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-none"
          />
        </div>

        {/* Accessibility hint */}
        {!isMobile && (
          <p className="text-xs text-muted-foreground mt-3">
            Press ESC to close
          </p>
        )}
      </div>
    </div>
  );
}
