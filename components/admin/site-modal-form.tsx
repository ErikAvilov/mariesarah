"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { SiteModalInsert, SiteModalRow } from "@/lib/site-modals";

export type SiteModalFormValues = Pick<
  SiteModalInsert,
  "title" | "image_url" | "target_url" | "is_active"
>;

type SiteModalFormProps = {
  initialValues: Partial<SiteModalRow> & SiteModalFormValues;
  onSubmit: (values: SiteModalFormValues) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  cancelHref: string;
  cancelLabel?: string;
  isEdit?: boolean;
};

const empty: SiteModalFormValues = {
  title: "",
  image_url: "",
  target_url: null,
  is_active: false,
};

export function SiteModalForm({
  initialValues,
  onSubmit,
  submitLabel,
  loading = false,
  error = null,
  cancelHref,
  cancelLabel = "Annuler",
  isEdit = false,
}: SiteModalFormProps) {
  const [form, setForm] = React.useState<SiteModalFormValues>(() => ({
    ...empty,
    ...initialValues,
    title: initialValues.title ?? "",
    image_url: initialValues.image_url ?? "",
    target_url: initialValues.target_url ?? null,
    is_active: initialValues.is_active ?? false,
  }));
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    form.image_url || null
  );
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const targetStr = form.target_url ?? "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setUploadError(null);
    if (!f) {
      setImageFile(null);
      if (isEdit && initialValues.image_url) {
        setImagePreview(initialValues.image_url);
        setForm((prev) => ({ ...prev, image_url: initialValues.image_url ?? "" }));
      } else {
        setImagePreview(null);
        setForm((prev) => ({ ...prev, image_url: "" }));
      }
      return;
    }
    if (!f.type.startsWith("image/")) {
      setUploadError("Veuillez choisir une image (JPEG, PNG, WebP ou GIF).");
      return;
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
    setForm((prev) => ({ ...prev, image_url: "" }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);

    let imageUrl = form.image_url;

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
      imageUrl = data.url;
      if (isEdit && initialValues.image_url?.startsWith("/images/")) {
        await fetch("/api/images/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: initialValues.image_url }),
        });
      }
    }

    if (!imageUrl?.trim()) {
      setUploadError("Indiquez une URL d’image ou importez un fichier.");
      return;
    }

    await onSubmit({
      title: form.title.trim(),
      image_url: imageUrl.trim(),
      target_url: targetStr.trim() ? targetStr.trim() : null,
      is_active: form.is_active,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <Label htmlFor="site-modal-title" className="mb-1 block">
          Titre
        </Label>
        <Input
          id="site-modal-title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          placeholder="ex. On My Way"
        />
      </div>
      <div>
        <Label htmlFor="site-modal-image-url" className="mb-1 block">
          URL de l&apos;image
        </Label>
        <Input
          id="site-modal-image-url"
          type="text"
          value={form.image_url}
          onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
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
          {isEdit && form.image_url && !imageFile && (
            <p className="text-sm text-muted-foreground">
              Image actuelle conservée. Choisir un fichier pour la remplacer.
            </p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt=""
              className="mt-2 h-40 w-auto max-w-full rounded-lg border border-border object-contain"
            />
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="site-modal-target-url" className="mb-1 block">
          URL cible (optionnel)
        </Label>
        <Input
          id="site-modal-target-url"
          type="text"
          value={targetStr}
          onChange={(e) =>
            setForm((f) => ({ ...f, target_url: e.target.value || null }))
          }
          placeholder="https://… (laisser vide = image non cliquable)"
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="site-modal-active"
          checked={form.is_active}
          onCheckedChange={(v) =>
            setForm((f) => ({ ...f, is_active: v === true }))
          }
        />
        <Label htmlFor="site-modal-active" className="text-sm font-normal cursor-pointer">
          Activer ce modal sur l&apos;accueil (désactive les autres)
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
