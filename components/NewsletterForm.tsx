"use client";

import React from "react"

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      {submitted ? (
        <p className="text-primary font-medium py-3">{t.newsletter.thankYou}</p>
      ) : (
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
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        {t.newsletter.disclaimer}
      </p>
    </div>
  );
}
