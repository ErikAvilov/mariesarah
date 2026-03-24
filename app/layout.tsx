import React from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { socialLinks } from "@/lib/data";
import { getSiteUrl, absoluteUrl } from "@/lib/site-config";
import "./globals.css";

const SITE_TITLE_DEFAULT =
  "Marie Sarah | Chanteuse soul — Site officiel";
const SITE_DESCRIPTION =
  "Marie Sarah, chanteuse soul à Paris : singles, clips, concerts et album « On My Way ». Écoutez sur Spotify, Apple Music, Deezer et toutes les plateformes.";

const baseUrl = getSiteUrl();
const ogImage = absoluteUrl("/images/portrait.jpg");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "Marie Sarah",
      description: SITE_DESCRIPTION,
      inLanguage: "fr-FR",
      publisher: { "@id": `${baseUrl}/#marie-sarah` },
    },
    {
      "@type": "MusicGroup",
      "@id": `${baseUrl}/#marie-sarah`,
      name: "Marie Sarah",
      url: baseUrl,
      image: ogImage,
      genre: ["Soul", "R&B", "Motown"],
      foundingLocation: {
        "@type": "Place",
        name: "Paris",
        addressCountry: "FR",
      },
      sameAs: [
        socialLinks.spotify,
        socialLinks.apple,
        socialLinks.youtube,
        socialLinks.instagram,
        socialLinks.deezer,
        socialLinks.facebook,
        socialLinks.linktree,
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/#accueil`,
      url: baseUrl,
      name: SITE_TITLE_DEFAULT,
      description: SITE_DESCRIPTION,
      isPartOf: { "@id": `${baseUrl}/#website` },
      inLanguage: "fr-FR",
      about: { "@id": `${baseUrl}/#marie-sarah` },
    },
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
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_TITLE_DEFAULT,
    template: "%s | Marie Sarah",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Marie Sarah",
  authors: [{ name: "Marie Sarah", url: baseUrl }],
  creator: "Marie Sarah",
  category: "music",
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: baseUrl,
    siteName: "Marie Sarah",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Marie Sarah — portrait, chanteuse soul",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [ogImage],
  },
  formatDetection: {
    telephone: false,
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
