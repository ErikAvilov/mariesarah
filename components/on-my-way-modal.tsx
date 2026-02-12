"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DELAY_SECONDS = 3;
const LINK_URL = "https://lnk.to/OnMyWay_MarieSarah";

export function OnMyWayModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, DELAY_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in-0 duration-300"
      onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative animate-in fade-in-0 duration-300 fill-mode-both [animation-delay:75ms]">
        <a
          href={LINK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-pointer"
        >
          <Image
            src="/images/on-my-way.png"
            alt="On My Way - Marie Sarah"
            width={768}
            height={768}
            className="max-h-[92vh] w-auto max-w-[min(768px,96vw)] cursor-pointer rounded-lg object-contain shadow-xl transition-transform hover:scale-[1.02]"
          />
        </a>
      </div>
    </div>
  );
}
