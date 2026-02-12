import { Lang, translations } from "@/lib/translations";

export function Footer({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <a
            href="#home"
            className="text-2xl font-serif font-bold tracking-[0.3em] text-foreground"
          >
            MARIE SARAH
          </a>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              © 2026 Marie Sarah. {t.footer.rights}
            </p>
            <p className="mt-1">
              Freedonia Entertainment · {t.footer.distributed}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
