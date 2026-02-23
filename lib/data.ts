export type Lang = "fr" | "en";

export interface TourDate {
  date: string;
  city: string;
  venue: string;
  ticketUrl: string | null;
  soldOut: boolean;
}

export interface Concert {
  id: string;
  date: string;
  city: string;
  venue: string;
  country: string;
  ticketUrl?: string;
  /** When true, show "Concert Privé" instead of billetterie (no link). */
  isPrivate?: boolean;
}

export interface Video {
  id: string;
  title: string;
  image: string;
  featured?: boolean;
}

export interface EP {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  image: string;
  tracks: string[];
  listenUrl: string;
  allLinksUrl: string;
}

export interface PressLink {
  title: string;
  source: string;
  year: string;
  url: string;
}

export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      music: "Musique",
      tour: "Concerts",
      bio: "Biographie",
      contact: "Contact",
      shop: "Shop",
    },
    hero: {
      newRelease: "Nouveau single disponible",
      subtitle: "Nouveau single disponible",
      listenNow: "Écouter",
      allLinks: "Toutes les plateformes",
    },
    music: {
      title: "Musique",
      singles: "Singles",
      premierEP: "Premier EP",
      listenEP: "Écouter",
      allLinks: "Toutes les plateformes",
    },
    tour: {
      title: "Concerts",
      noShows: "Pas de concerts programmés pour le moment.",
      followSocials:
        "Suivez-moi sur les réseaux sociaux pour les prochaines dates.",
      tickets: "Billetterie",
      concertPrive: "Concert Privé",
      reserve: "Réserver",
      soldOut: "Complet",
      upcoming: "Prochains concerts",
      past: "Concerts passés",
      noPastDates: "Aucune date à venir pour le moment",
    },
    bio: {
      title: "Biographie",
      sealQuote:
        '"Une voix exceptionnelle qui me rappelle les grands de la soul."',
      sealAttrib: "— Seal",
      paragraphs: [
        "Issue d'une maman française et d'un papa camerounais, Marie Sarah a 25 ans et a grandi la télé branchée sur les chaînes de clips. C'était comédie musicale non-stop à la maison.",
        "La révélation : Dreamgirls, le film sur Diana Ross et Les Supremes. Dès lors, les sons feutrés, les cuivres, les crooners, la soul brute des années 60 deviennent sa passion : Otis Redding, Etta James, Motown, Stax, Chess Records.",
        "Après une formation au Cours Florent en comédie musicale, Marie Sarah est repérée suite à la mise en ligne d'une reprise d'Etta James « I'd Rather Go Blind ». Depuis la sortie de son premier EP en avril 2024 (+1.4M de streams Spotify), elle est passée sur Taratata, a fait les premières parties de Boyz II Men, Gavin DeGraw, Tower of Power, et a accompagné Seal sur 6 Zénith en France.",
        "Son premier album « On My Way » sort le 13 mars 2026.",
      ],
    },
    press: {
      title: "Presse / Télés / Radios",
      read: "Lire",
    },
    newsletter: {
      title: "Newsletter",
      subtitle:
        "Recevez en avant-première les actualités, les dates de concert et les sorties exclusives.",
      placeholder: "Votre adresse e-mail",
      button: "S'inscrire",
      disclaimer:
        "En vous inscrivant, vous acceptez de recevoir des emails de Marie Sarah. Vous pouvez vous désinscrire à tout moment.",
      thankYou: "Merci pour votre inscription !",
    },
    contact: {
      title: "Contact",
      subtitle: "Pour les demandes de booking, presse ou collaboration.",
      button: "Envoyer un e-mail",
    },
    footer: {
      listen: "Écouter",
      follow: "Suivre",
      rights: "Tous droits réservés.",
      distributed: "Distribué par Sony Music France",
    },
  },
  en: {
    nav: {
      home: "Home",
      music: "Music",
      tour: "Tour",
      bio: "Bio",
      contact: "Contact",
      shop: "Shop",
    },
    hero: {
      newRelease: "New Release",
      subtitle: "Latest Single Out Now",
      listenNow: "Listen Now",
      allLinks: "All platforms",
    },
    music: {
      title: "Music",
      singles: "Singles",
      premierEP: "Featured EP",
      listenEP: "Listen",
      allLinks: "All platforms",
    },
    tour: {
      title: "Tour",
      noShows: "No upcoming shows at the moment.",
      followSocials: "Follow me on social media for upcoming dates.",
      tickets: "Tickets",
      concertPrive: "Private Concert",
      reserve: "Reserve",
      soldOut: "Sold Out",
      upcoming: "Upcoming Concerts",
      past: "Past Concerts",
      noPastDates: "No upcoming dates at the moment",
    },
    bio: {
      title: "Biography",
      sealQuote:
        '"An exceptional voice that reminds me of the great soul legends."',
      sealAttrib: "— Seal",
      paragraphs: [
        "Born 25 years ago to a French mother and Cameroonian father, Marie Sarah grew up in a home where the TV was always tuned to music video channels. It was a constant musical comedy at home.",
        "The revelation came with Dreamgirls—the film about Diana Ross and The Supremes. From that moment, velvet sounds, brass sections, crooners, and the raw soul of the 60s became her passion: Otis Redding, Etta James, Motown, Stax, Chess Records.",
        "After training at Cours Florent in musical theatre, Marie Sarah was discovered after posting a cover of Etta James' \"I'd Rather Go Blind.\" Since releasing her debut EP in April 2024 (1.4M+ Spotify streams), she has appeared on Taratata, opened for Boyz II Men, Gavin DeGraw, Tower of Power, and toured with Seal across 6 French Zeniths.",
        "Her debut album \"On My Way\" arrives March 14, 2026.",
      ],
    },
    press: {
      title: "Press / TV / Radio",
      read: "Read",
    },
    newsletter: {
      title: "Newsletter",
      subtitle: "Get early access to news, tour dates and exclusive releases.",
      placeholder: "Your email address",
      button: "Subscribe",
      disclaimer:
        "By subscribing, you agree to receive emails from Marie Sarah. You can unsubscribe at any time.",
      thankYou: "Thanks for subscribing!",
    },
    contact: {
      title: "Contact",
      subtitle: "For booking, press or collaboration inquiries.",
      button: "Send Email",
    },
    footer: {
      listen: "Listen",
      follow: "Follow",
      rights: "All rights reserved.",
      distributed: "Distributed by Sony Music France",
    },
  },
} as const;

export type Translations = typeof translations;

export const socialLinks = {
  spotify: "https://open.spotify.com/intl-fr/artist/6eKmkdJGSByhfNDciam6bC",
  apple: "https://music.apple.com/fr/artist/marie-sarah/1729365500",
  deezer: "https://www.deezer.com/fr/artist/253387942",
  youtube: "https://www.youtube.com/@MarieSarahOfficialChannel/",
  instagram: "https://www.instagram.com/mariesarah_officiel/",
  facebook: "https://www.facebook.com/p/Marie-Sarah-Officiel-61556176504399/",
  linktree: "https://lnk.to/DarkBlack",
} as const;

/** URL du shop (à définir quand le site sera en ligne) */
export const shopUrl = "https://shop.mariesarah.com";

export const youtubeVideos: Video[] = [
    {
        id: "QCBdPFMTpt0",
        title: "Can Feel It",
        image: "/images/can-feel-it.jpg",
        featured: true,
    },
    {
        id: "YL1-sAehOYg",
        title: "Give Up On You",
        image: "/images/give-up-on-you.jpg",
    },
    {
        id: "NXVTYB8dk_4",
        title: "Better Now",
        image: "/images/better-now.jpg",
    },
    {
        id: "o5Cw3bWCxAg",
        title: "You Were Mine",
        image: "/images/portrait.jpg",
    },
    {
        id: "PF1JRLFhUpM",
        title: "You Know I'm No Good",
        image: "/images/you-know-im-no-good.jpg",
    },
    {
        id: "2_uc6lY9vBg",
        title: "Hold Me",
        image: "/images/hold-me.jpg",
    },
    {
        id: "ELKiUV3b2YA",
        title: "Dark Black",
        image: "/images/dark-black.jpg",
    },
];

export const pressLinks: PressLink[] = [
  {
    title: "Can Feel It - Le live de Marie Sarah",
    source: "Europe 1",
    year: "2026",
    url: "https://www.europe1.fr/emissions/culture-medias/can-feel-it-le-live-de-marie-sarah-dans-culture-medias-877640",
  },
  {
    title: "Marie Sarah dévoile Can Feel It",
    source: "JazzRadio",
    year: "2025",
    url: "https://www.jazzradio.fr/news/musique/41849/marie-sarah-devoile-can-feel-it-une-soul-moderne-entre-douceur-et-intensite",
  },
  {
    title: "Marie Sarah - La voix soul qui monte",
    source: "Radio Vinci",
    year: "2025",
    url: "https://radio.vinci-autoroutes.com/article/marie-sarah-la-voix-soul-qui-monte-sur-la-scene-francaise-14963",
  },
  {
    title: "Taratata Interview",
    source: "Taratata",
    year: "2024",
    url: "https://mytaratata.com/taratata/583/interview-marie-sarah-2024",
  },
  {
    title: "Marie Sarah au WeAre",
    source: "WeAre",
    year: "2024",
    url: "https://www.weare.sh/event/marie-sarah-la-revelation-soul/",
  },
  {
    title: "Taratata Dark Black Live",
    source: "Taratata",
    year: "2024",
    url: "https://mytaratata.com/taratata/583/marie-sarah-dark-black-2024",
  },
];

export const tourDates: TourDate[] = [];

export const concerts: Concert[] = [
  {
    id: "concert-past-1",
    date: "2024-04-24",
    city: "Paris",
    venue: "We are live",
    country: "France",
  },
  {
    id: "concert-past-2",
    date: "2024-04-26",
    city: "Boulogne-Billancourt",
    venue: "Première partie des Boyz II Men – La Seine Musicale",
    country: "France",
  },
  {
    id: "concert-past-3",
    date: "2024-10-03",
    city: "Paris",
    venue: "Première partie de Seal – Zenith",
    country: "France",
  },
  {
    id: "concert-past-4",
    date: "2024-10-21",
    city: "Paris",
    venue: "Première partie de Gavin DeGraw – L'Olympia",
    country: "France",
  },
  {
    id: "concert-past-5",
    date: "2024-11-09",
    city: "Paris",
    venue: "Première partie de Tower of Power – Casino de Paris",
    country: "France",
  },
  {
    id: "concert-past-6",
    date: "2025-03-14",
    city: "Paris",
    venue: "Première partie de The Amy Winehouse Band – La Cigale",
    country: "France",
  },
  {
    id: "concert-past-7",
    date: "2025-10-02",
    city: "Paris",
    venue: "Bizz'art club",
    country: "France",
  },
  {
    id: "concert-1",
    date: "2025-05-24",
    city: "Saintes",
    venue: "Le quai du Blues",
    country: "France",
    ticketUrl: "https://www.lequaidubleues.com",
  },
  {
    id: "concert-2",
    date: "2025-07-05",
    city: "Enghien-les-Bains",
    venue: "Barrière Enghien Jazz Festival",
    country: "France",
    ticketUrl: "https://www.barriereenghjazz.com",
  },
  {
    id: "concert-3",
    date: "2025-07-18",
    city: "Robion",
    venue: "Théâtre de Verduire",
    country: "France",
    ticketUrl: "https://www.theatreverduire.com",
  },
  {
    id: "concert-4",
    date: "2026-03-12",
    city: "Paris",
    venue: "We Are — Release Party Album",
    country: "France",
    isPrivate: true,
  },
  {
    id: "concert-5",
    date: "2026-03-27",
    city: "Thaon-Les-Vosges",
    venue: "La Rotonde",
    country: "France",
    ticketUrl: "https://cornolti.trium.fr/fr/t/-/event/65368",
  },
  {
    id: "concert-6",
    date: "2026-06-05",
    city: "Contrexeville",
    venue: "La Grande Fa'Brique",
    country: "France",
    ticketUrl: undefined,
  },
  {
    id: "concert-7",
    date: "2026-08-15",
    city: "Saintes",
    venue: "Les arènes de Saintes",
    country: "France",
    ticketUrl: "https://my.weezevent.com/blues-in-saintes",
  },
];

export const featuredEP: EP = {
  id: "dark-black-ep",
  title: "Dark Black",
  artist: "Marie Sarah",
  year: 2024,
  genre: "Pop / Soul",
  image: "/images/dark-black.jpg",
  tracks: [
    "Dark Black",
    "You Were Mine",
    "Brand New Day",
    "Hold Me",
    "If I Can Dream",
  ],
  listenUrl: "https://open.spotify.com/intl-fr/album/2eV8dXQXxJderdQEvY3ZuC",
  allLinksUrl: "https://lnk.to/DarkBlack",
};

export const contactEmail = "contact@mariesarah.com";
