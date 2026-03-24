import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { MusicSection } from "@/components/music-section";
import { ConcertsSection } from "@/components/concerts-section";
import { BioSection } from "@/components/bio-section";
import { PressSection } from "@/components/press-section";
import { Footer } from "@/components/footer";
import { SectionBlend } from "@/components/section-blend";
import { PromotionalSiteModal } from "@/components/promotional-site-modal";
import { getSingles } from "@/lib/singles";
import { getPublicFeaturedAlbum } from "@/lib/albums";
import { getActiveSiteModal } from "@/lib/site-modals";
import { getActiveHeroHighlight } from "@/lib/hero-highlights";

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
