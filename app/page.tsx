import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { MusicSection } from "@/components/music-section";
import { ConcertsSection } from "@/components/concerts-section";
import { BioSection } from "@/components/bio-section";
import { PressSection } from "@/components/press-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { SectionBlend } from "@/components/section-blend";
import { OnMyWayModal } from "@/components/on-my-way-modal";

export default function Home() {
  const lang = "fr" as const;

  return (
    <main>
      <OnMyWayModal />
      <Header />
      <Hero lang={lang} />
      <MusicSection lang={lang} />
      <SectionBlend from="background" to="card" />
      <ConcertsSection lang={lang} />
      <SectionBlend from="card" to="secondary" />
      <BioSection lang={lang} />
      <SectionBlend from="secondary" to="background" />
      <PressSection lang={lang} />
      <SectionBlend from="background" to="card" />
      <NewsletterSection lang={lang} />
      <SectionBlend from="card" to="background" />
      <ContactSection lang={lang} />
      <SectionBlend from="background" to="card" />
      <Footer lang={lang} />
    </main>
  );
}
