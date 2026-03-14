import React from "react"
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { socialLinks } from "@/lib/data";
import "./globals.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Marie Sarah",
  genre: ["Soul", "R&B", "Motown"],
  url: "/",
  image: "/images/portrait.jpg",
  foundingLocation: { "@type": "Place", name: "Paris, France" },
  sameAs: [
    socialLinks.spotify,
    socialLinks.apple,
    socialLinks.youtube,
    socialLinks.instagram,
    socialLinks.deezer,
    socialLinks.facebook,
  ],
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Marie Sarah | Official Website",
  description:
    "Marie Sarah - Soul singer from Paris. New album 'On My Way' coming March 2026. Listen to 'Can Feel It', 'Dark Black', 'Better Now' and more.",
  keywords: [
    "Marie Sarah",
    "soul music",
    "French soul singer",
    "R&B",
    "Motown",
    "Paris",
  ],
  openGraph: {
    title: "Marie Sarah | Official Website",
    description:
      "Soul singer from Paris. New album 'On My Way' coming March 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="preload"
          href="/fonts/Rockstar-ExtraBold.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* Created by Nefatafl */}
      <body
        className={`${plusJakarta.variable} ${playfair.variable} ${montserrat.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
