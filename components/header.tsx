"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Lang, translations } from "@/lib/translations";
import {
  SpotifyIcon,
  AppleMusicIcon,
  DeezerIcon,
  YouTubeIcon,
  InstagramIcon,
  FacebookIcon,
} from "@/components/Icons";
import { socialLinks, shopUrl } from "@/lib/data";

export function Header() {
  const [lang, setLang] = useState<Lang>("fr");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const browserLang = navigator.language || "";
    if (browserLang.startsWith("en")) {
      setLang("en");
    }
  }, []);

  const t = translations[lang];
  const navLinks = [
    { href: "#home", label: t.nav.home },
    { href: "#music", label: t.nav.music },
    { href: "#tour", label: t.nav.tour },
    { href: "#bio", label: t.nav.bio },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <Link
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative px-4 py-2.5 text-sm font-medium uppercase tracking-widest border-2 border-foreground/80 text-foreground overflow-hidden transition-all duration-300 hover:border-primary hover:text-white hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span className="relative z-10">{t.nav.shop}</span>
              <span className="absolute inset-0 z-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </Link>
          </nav>

          <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:mx-auto">
            <a
              href="#home"
              className="text-2xl font-bebas font-black tracking-[0.12em] text-foreground"
            >
              MARIE SARAH
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={socialLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-[#1DB954]"
              aria-label="Spotify"
            >
              <SpotifyIcon className="h-5 w-5" />
            </Link>
            <Link
              href={socialLinks.apple}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-[#FA243C]"
              aria-label="Apple Music"
            >
              <AppleMusicIcon className="h-5 w-5" />
            </Link>
            <Link
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-[#FF0000]"
              aria-label="YouTube"
            >
              <YouTubeIcon className="h-5 w-5" />
            </Link>
            <Link
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-[#E4405F]"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-5 w-5" />
            </Link>
            <Link
              href={socialLinks.deezer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-[#FEAA2D]"
              aria-label="Deezer"
            >
              <DeezerIcon className="h-5 w-5" />
            </Link>
            <Link
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-[#1877F2]"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-5 w-5" />
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border">
          <nav className="flex flex-col items-center gap-4 py-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <Link
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="relative mt-2 px-6 py-3 text-sm font-medium uppercase tracking-widest border-2 border-foreground/80 text-foreground overflow-hidden transition-all duration-300 hover:border-primary hover:text-white hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span className="relative z-10">{t.nav.shop}</span>
              <span className="absolute inset-0 z-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </Link>
            <div className="flex items-center gap-4 pt-4 border-t border-border mt-2">
              <Link
                href={socialLinks.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-[#1DB954]"
              >
                <SpotifyIcon className="h-5 w-5" />
              </Link>
              <Link
                href={socialLinks.apple}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-[#FA243C]"
              >
                <AppleMusicIcon className="h-5 w-5" />
              </Link>
              <Link
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-[#FF0000]"
              >
                <YouTubeIcon className="h-5 w-5" />
              </Link>
              <Link
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-[#E4405F]"
              >
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link
                href={socialLinks.deezer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-[#FEAA2D]"
              >
                <DeezerIcon className="h-5 w-5" />
              </Link>
              <Link
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-[#1877F2]"
              >
                <FacebookIcon className="h-5 w-5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
