import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { MusicSection } from "@/components/music-section";
import { ConcertsSection } from "@/components/concerts-section";
import { BioSection } from "@/components/bio-section";
import { PressSection } from "@/components/press-section";
import { Footer } from "@/components/footer";
import { SectionBlend } from "@/components/section-blend";
import { OnMyWayModal } from "@/components/on-my-way-modal";
import { getSingles } from "@/lib/singles";
import { getPublicFeaturedAlbum } from "@/lib/albums";

export const dynamic = "force-dynamic";

export default async function Home() {
  const lang = "fr" as const;
  const [singles, featuredAlbum] = await Promise.all([
    getSingles(),
    getPublicFeaturedAlbum(),
  ]);

  return (
    <main>
      <OnMyWayModal />
      <Header />
      <Hero lang={lang} />
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
