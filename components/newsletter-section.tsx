"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lang, translations } from "@/lib/translations";

export function NewsletterSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      lang === "fr"
        ? `Merci pour votre inscription : ${email}`
        : `Thanks for subscribing with: ${email}`
    );
    setEmail("");
  };

  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-bebas text-3xl sm:text-4xl font-bold uppercase text-foreground mb-4">
          {t.newsletter.title}
        </h2>
        <p className="text-muted-foreground mb-8">{t.newsletter.subtitle}</p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.newsletter.placeholder}
            required
            className="flex-1 px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-sm uppercase tracking-widest"
          >
            {t.newsletter.button}
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          {lang === "fr"
            ? "En vous inscrivant, vous acceptez de recevoir des emails de Marie Sarah. Vous pouvez vous desinscrire a tout moment."
            : "By subscribing, you agree to receive emails from Marie Sarah. You can unsubscribe at any time."}
        </p>
      </div>
    </section>
  );
}
