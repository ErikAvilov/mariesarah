"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Lang, translations } from "@/lib/translations";
import { getPressLinks, type PressRow } from "@/lib/press";
import { supabase } from "@/lib/supabase";

export function PressSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [links, setLinks] = useState<PressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getPressLinks()
      .then(setLinks)
      .catch(() => setLinks([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
  }, []);

  return (
    <section id="press" className="py-20 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          {isAdmin && (
            <Link
              href="/admin/press/new"
              className="absolute right-0 top-0 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-2xl font-semibold shadow-md hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
              aria-label="Ajouter un lien presse"
            >
              +
            </Link>
          )}
          <h2 className="font-bebas text-4xl sm:text-5xl font-bold uppercase text-foreground mb-4">
            {t.press.title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-card rounded-lg border border-border animate-pulse h-32" />
            <div className="p-6 bg-card rounded-lg border border-border animate-pulse h-32" />
            <div className="p-6 bg-card rounded-lg border border-border animate-pulse h-32" />
          </div>
        ) : links.length === 0 ? (
          <p className="text-center text-muted-foreground max-w-4xl mx-auto">
            Aucun lien presse pour le moment.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {links.map((press) => (
              <Link
                key={press.id}
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
        )}
      </div>
    </section>
  );
}
