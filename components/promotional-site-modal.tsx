"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ActiveSiteModalPayload } from "@/lib/site-modals";

const DELAY_SECONDS = 3;

const imageClassName =
  "max-h-[92vh] w-auto max-w-[min(768px,96vw)] rounded-lg object-contain shadow-xl";

export function PromotionalSiteModal({
  modal,
}: {
  modal: ActiveSiteModalPayload | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!modal) return;
    const timer = setTimeout(() => setIsOpen(true), DELAY_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [modal]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!modal || !isOpen) return null;

  const target = modal.target_url?.trim() ?? "";
  const hasTarget = target.length > 0;
  const openInNewTab = /^https?:\/\//i.test(target);

  const img = (
    <Image
      src={modal.image_url}
      alt={modal.title || "Annonce"}
      width={768}
      height={768}
      className={
        hasTarget
          ? `${imageClassName} cursor-pointer transition-transform hover:scale-[1.02]`
          : imageClassName
      }
      priority
    />
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in-0 duration-300"
      onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
      aria-modal="true"
      role="dialog"
      aria-labelledby="promo-modal-title"
    >
      <div className="relative animate-in fade-in-0 duration-300 fill-mode-both [animation-delay:75ms]">
        <p id="promo-modal-title" className="sr-only">
          {modal.title}
        </p>
        {hasTarget ? (
          <a
            href={target}
            {...(openInNewTab
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="block"
          >
            {img}
          </a>
        ) : (
          img
        )}
      </div>
    </div>
  );
}
