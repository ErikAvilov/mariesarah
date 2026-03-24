"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { insertHeroHighlight } from "@/lib/hero-highlights";
import {
  HeroHighlightForm,
  type HeroHighlightFormValues,
} from "@/components/admin/hero-highlight-form";

export function NewHeroHighlightForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: HeroHighlightFormValues) {
    setError(null);
    setLoading(true);
    const { error: err } = await insertHeroHighlight(values);
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
        Nouveau hero d&apos;accueil
      </h1>
      <HeroHighlightForm
        initialValues={{
          eyebrow: "",
          title: "",
          artist_name: "",
          cta_label: "Écouter",
          target_url: "",
          background_image_url: "",
          is_active: false,
          display_order: 0,
        }}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer"
        loading={loading}
        error={error}
        cancelHref="/admin/hero-highlights"
        cancelLabel="Annuler"
        isEdit={false}
      />
      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-foreground">
          ← Tableau de bord
        </Link>
      </p>
    </div>
  );
}
