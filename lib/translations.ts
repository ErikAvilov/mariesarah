export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      music: "Musique",
      tour: "Concerts",
      bio: "Biographie",
      contact: "Contact",
    },
    hero: {
      newRelease: "Nouveau single disponible",
      subtitle: "Nouveau single disponible",
      listenNow: "Écouter",
      allLinks: "Toutes les plateformes",
    },
    music: {
      title: "Musique & singles",
      premierEP: "Premier EP",
      singles: "Singles",
      listenEP: "Écouter l'EP",
      allLinks: "Toutes les plateformes",
      trackList: "Morceaux",
    },
    tour: {
      title: "Concerts",
      noShows: "Pas de concerts programmés pour le moment.",
      followSocials: "Suivez-moi sur les réseaux sociaux pour les prochaines dates.",
      tickets: "Billetterie",
      soldOut: "Complet",
    },
    bio: {
      title: "Biographie",
      sealQuote: '"Une voix exceptionnelle qui me rappelle les grands de la soul."',
      sealAttrib: "— Seal",
    },
    press: {
      title: "Presse / Télés / Radios",
      read: "Lire",
    },
    newsletter: {
      title: "Newsletter",
      subtitle: "Recevez en avant-première les actualités, les dates de concert et les sorties exclusives.",
      placeholder: "Votre adresse e-mail",
      button: "S'inscrire",
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
    },
    hero: {
      newRelease: "New Release",
      subtitle: "Latest Single Out Now",
      listenNow: "Listen Now",
      allLinks: "All Links",
    },
    music: {
      title: "Music & singles",
      premierEP: "Premier EP",
      singles: "Singles",
      listenEP: "Listen to the EP",
      allLinks: "All platforms",
      trackList: "Tracks",
    },
    tour: {
      title: "Tour",
      noShows: "No upcoming shows at the moment.",
      followSocials: "Follow me on social media for upcoming dates.",
      tickets: "Tickets",
      soldOut: "Sold Out",
    },
    bio: {
      title: "Biography",
      sealQuote: '"An exceptional voice that reminds me of the great soul legends."',
      sealAttrib: "— Seal",
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

export type Lang = "fr" | "en";
export type Translations = typeof translations;
