"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { translations, socialLinks } from "@/lib/data";
import {
  SpotifyIcon,
  AppleMusicIcon,
  YouTubeIcon,
  InstagramIcon,
} from "@/components/Icons";

export function HeaderClient() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: t.nav.home },
    { href: "#music", label: t.nav.music },
    { href: "#tour", label: t.nav.tour },
    { href: "#bio", label: t.nav.bio },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md" : "bg-transparent"
      }`}
    >
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
          </nav>

          <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:mx-auto">
            <a
              href="#home"
              className="text-xl font-serif font-bold tracking-[0.3em] text-foreground"
            >
              MARIE SARAH
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={socialLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-primary"
              aria-label="Spotify"
            >
              <SpotifyIcon className="h-5 w-5" />
            </Link>
            <Link
              href={socialLinks.apple}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-primary"
              aria-label="Apple Music"
            >
              <AppleMusicIcon className="h-5 w-5" />
            </Link>
            <Link
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-primary"
              aria-label="YouTube"
            >
              <YouTubeIcon className="h-5 w-5" />
            </Link>
            <Link
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-primary"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-5 w-5" />
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
            <div className="flex items-center gap-4 pt-4 border-t border-border mt-2">
              <Link
                href={socialLinks.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-primary"
              >
                <SpotifyIcon className="h-5 w-5" />
              </Link>
              <Link
                href={socialLinks.apple}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-primary"
              >
                <AppleMusicIcon className="h-5 w-5" />
              </Link>
              <Link
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-primary"
              >
                <YouTubeIcon className="h-5 w-5" />
              </Link>
              <Link
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 transition-colors hover:text-primary"
              >
                <InstagramIcon className="h-5 w-5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
