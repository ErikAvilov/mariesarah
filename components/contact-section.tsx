import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lang, translations } from "@/lib/translations";
import { contactEmail } from "@/lib/data";

export function ContactSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return (
    <section id="contact" className="py-20 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-bebas text-4xl sm:text-5xl font-bold uppercase text-foreground mb-4">
          {t.contact.title}
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto mb-8" />

        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          {t.contact.subtitle}
        </p>

        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-sm uppercase tracking-widest"
        >
          <Link href={`mailto:${contactEmail}`}>
            <Mail className="mr-2 h-5 w-5" />
            {t.contact.button}
          </Link>
        </Button>
      </div>
    </section>
  );
}
