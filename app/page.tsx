import nextDynamic from "next/dynamic";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { SectionBlend } from "@/components/section-blend";
import { getSingles } from "@/lib/singles";
import { getPublicFeaturedAlbum } from "@/lib/albums";
import { getActiveSiteModal } from "@/lib/site-modals";
import { getActiveHeroHighlight } from "@/lib/hero-highlights";

const PromotionalSiteModal = nextDynamic(() =>
  import("@/components/promotional-site-modal").then((m) => ({
    default: m.PromotionalSiteModal,
  }))
);

const MusicSection = nextDynamic(() =>
  import("@/components/music-section").then((m) => ({ default: m.MusicSection }))
);

const ConcertsSection = nextDynamic(() =>
  import("@/components/concerts-section").then((m) => ({
    default: m.ConcertsSection,
  }))
);

const BioSection = nextDynamic(() =>
  import("@/components/bio-section").then((m) => ({ default: m.BioSection }))
);

const PressSection = nextDynamic(() =>
  import("@/components/press-section").then((m) => ({ default: m.PressSection }))
);

const Footer = nextDynamic(() =>
  import("@/components/footer").then((m) => ({ default: m.Footer }))
);

export const dynamic = "force-dynamic";

export default async function Home() {
  const lang = "fr" as const;
  const [singles, featuredAlbum, activeModal, heroHighlight] = await Promise.all([
    getSingles(),
    getPublicFeaturedAlbum(),
    getActiveSiteModal(),
    getActiveHeroHighlight(),
  ]);

  return (
    <main>
      <PromotionalSiteModal modal={activeModal} />
      <Header />
      <Hero lang={lang} highlight={heroHighlight} />
      <MusicSection lang={lang} singles={singles} featuredAlbum={featuredAlbum} />
      <SectionBlend from="background" to="card" />
      <ConcertsSection lang={lang} />
      <SectionBlend from="card" to="secondary" />
      <BioSection lang={lang} />
      <SectionBlend from="secondary" to="background" />
      <PressSection lang={lang} />
      <SectionBlend from="background" to="card" />
      <Footer lang={lang} />
    </main>
  );
}
