"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateHeroHighlight, type HeroHighlightRow } from "@/lib/hero-highlights";
import {
  HeroHighlightForm,
  type HeroHighlightFormValues,
} from "@/components/admin/hero-highlight-form";

function rowToForm(row: HeroHighlightRow): HeroHighlightFormValues {
  return {
    eyebrow: row.eyebrow,
    title: row.title,
    artist_name: row.artist_name,
    cta_label: row.cta_label,
    target_url: row.target_url,
    background_image_url: row.background_image_url,
    is_active: row.is_active,
    display_order: row.display_order,
  };
}

export function EditHeroHighlightForm({ item }: { item: HeroHighlightRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: HeroHighlightFormValues) {
    setError(null);
    setLoading(true);
    const { error: err } = await updateHeroHighlight(item.id, values);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/admin/hero-highlights");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-xl mx-auto">
      <h1 className="font-bebas text-2xl uppercase text-foreground mb-6">
        Modifier le hero
      </h1>
      <HeroHighlightForm
        initialValues={rowToForm(item)}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer"
        loading={loading}
        error={error}
        cancelHref="/admin/hero-highlights"
        cancelLabel="Annuler"
        isEdit
      />
      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-foreground">
          ← Tableau de bord
        </Link>
      </p>
    </div>
  );
}
