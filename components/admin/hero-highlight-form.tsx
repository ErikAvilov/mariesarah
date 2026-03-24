"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { HeroHighlightInsert, HeroHighlightRow } from "@/lib/hero-highlights";

export type HeroHighlightFormValues = HeroHighlightInsert;

type HeroHighlightFormProps = {
  initialValues: Partial<HeroHighlightRow> & HeroHighlightFormValues;
  onSubmit: (values: HeroHighlightFormValues) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  cancelHref: string;
  cancelLabel?: string;
  isEdit?: boolean;
};

const empty: HeroHighlightFormValues = {
  eyebrow: "",
  title: "",
  artist_name: "",
  cta_label: "Écouter",
  target_url: "",
  background_image_url: "",
  is_active: false,
  display_order: 0,
};

export function HeroHighlightForm({
  initialValues,
  onSubmit,
  submitLabel,
  loading = false,
  error = null,
  cancelHref,
  cancelLabel = "Annuler",
  isEdit = false,
}: HeroHighlightFormProps) {
  const [form, setForm] = React.useState<HeroHighlightFormValues>(() => ({
    ...empty,
    ...initialValues,
    eyebrow: initialValues.eyebrow ?? "",
    title: initialValues.title ?? "",
    artist_name: initialValues.artist_name ?? "",
    cta_label: initialValues.cta_label ?? "Écouter",
    target_url: initialValues.target_url ?? "",
    background_image_url: initialValues.background_image_url ?? "",
    is_active: initialValues.is_active ?? false,
    display_order:
      initialValues.display_order !== undefined ? initialValues.display_order : 0,
  }));
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    form.background_image_url || null
  );
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setUploadError(null);
    if (!f) {
      setImageFile(null);
      if (isEdit && initialValues.background_image_url) {
        setImagePreview(initialValues.background_image_url);
        setForm((prev) => ({
          ...prev,
          background_image_url: initialValues.background_image_url ?? "",
        }));
      } else {
        setImagePreview(null);
        setForm((prev) => ({ ...prev, background_image_url: "" }));
      }
      return;
    }
    if (!f.type.startsWith("image/")) {
      setUploadError("Veuillez choisir une image (JPEG, PNG, WebP ou GIF).");
      return;
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
    setForm((prev) => ({ ...prev, background_image_url: "" }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);

    let bgUrl = form.background_image_url;

    if (imageFile) {
      const formData = new FormData();
      formData.set("file", imageFile);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUploadError(data.error ?? "Erreur lors de l’upload.");
        return;
      }
      bgUrl = data.url;
      if (isEdit && initialValues.background_image_url?.startsWith("/images/")) {
        await fetch("/api/images/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: initialValues.background_image_url }),
        });
      }
    }

    if (!bgUrl?.trim()) {
      setUploadError("Indiquez une URL d’image de fond ou importez un fichier.");
      return;
    }

    if (!form.target_url?.trim()) {
      setUploadError("L’URL de destination du CTA est requise.");
      return;
    }

    await onSubmit({
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
      artist_name: form.artist_name.trim(),
      cta_label: form.cta_label.trim() || "Écouter",
      target_url: form.target_url.trim(),
      background_image_url: bgUrl.trim(),
      is_active: form.is_active,
      display_order: Math.max(0, Number(form.display_order) || 0),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <Label htmlFor="hh-eyebrow" className="mb-1 block">
          Accroche (eyebrow)
        </Label>
        <Input
          id="hh-eyebrow"
          value={form.eyebrow}
          onChange={(e) => setForm((f) => ({ ...f, eyebrow: e.target.value }))}
          placeholder="ex. Nouveau single"
        />
      </div>
      <div>
        <Label htmlFor="hh-title" className="mb-1 block">
          Titre
        </Label>
        <Input
          id="hh-title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          placeholder="ex. Can Feel It"
        />
      </div>
      <div>
        <Label htmlFor="hh-artist" className="mb-1 block">
          Artiste
        </Label>
        <Input
          id="hh-artist"
          value={form.artist_name}
          onChange={(e) => setForm((f) => ({ ...f, artist_name: e.target.value }))}
          required
          placeholder="Marie Sarah"
        />
      </div>
      <div>
        <Label htmlFor="hh-cta" className="mb-1 block">
          Libellé du bouton
        </Label>
        <Input
          id="hh-cta"
          value={form.cta_label}
          onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))}
          placeholder="Écouter"
        />
      </div>
      <div>
        <Label htmlFor="hh-target" className="mb-1 block">
          URL du CTA
        </Label>
        <Input
          id="hh-target"
          type="text"
          value={form.target_url}
          onChange={(e) => setForm((f) => ({ ...f, target_url: e.target.value }))}
          required
          placeholder="https://…"
        />
      </div>
      <div>
        <Label htmlFor="hh-bg-url" className="mb-1 block">
          URL image de fond
        </Label>
        <Input
          id="hh-bg-url"
          type="text"
          value={form.background_image_url}
          onChange={(e) =>
            setForm((f) => ({ ...f, background_image_url: e.target.value }))
          }
          placeholder="/images/… ou https://…"
        />
        <div className="mt-2 space-y-2">
          <Label className="text-muted-foreground text-xs">Ou fichier image</Label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {isEdit && form.background_image_url && !imageFile && (
            <p className="text-sm text-muted-foreground">
              Image actuelle conservée. Choisir un fichier pour la remplacer.
            </p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt=""
              className="mt-2 h-32 w-full max-w-md rounded-lg border border-border object-cover"
            />
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="hh-order" className="mb-1 block">
          Ordre d&apos;affichage
        </Label>
        <Input
          id="hh-order"
          type="number"
          min={0}
          className="w-28"
          value={form.display_order}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              display_order: Math.max(0, parseInt(e.target.value, 10) || 0),
            }))
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="hh-active"
          checked={form.is_active}
          onCheckedChange={(v) =>
            setForm((f) => ({ ...f, is_active: v === true }))
          }
        />
        <Label htmlFor="hh-active" className="text-sm font-normal cursor-pointer">
          Actif sur l&apos;accueil (désactive les autres)
        </Label>
      </div>
      {(error || uploadError) && (
        <p className="text-sm text-destructive">{uploadError ?? error}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Envoi…" : submitLabel}
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href={cancelHref}>{cancelLabel}</a>
        </Button>
      </div>
    </form>
  );
}
