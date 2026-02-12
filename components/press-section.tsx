import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Lang, translations } from "@/lib/translations";
import { pressLinks } from "@/lib/data";

export function PressSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bebas text-4xl sm:text-5xl font-bold uppercase text-foreground mb-4">
            {t.press.title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {pressLinks.map((press, index) => (
            <Link
              key={index}
              href={press.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-card rounded-lg border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-primary font-medium">
                  {press.source}
                </span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {press.title}
              </h3>
              <p className="text-sm text-muted-foreground">{press.year}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
