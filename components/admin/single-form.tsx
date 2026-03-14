"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { SingleRow, SingleInsert } from "@/lib/singles";

type SingleFormValues = SingleInsert;

type SingleFormProps = {
  initialValues: Partial<SingleRow> &
    Pick<SingleInsert, "title" | "youtube_url" | "image_url" | "display_order">;
  onSubmit: (values: SingleFormValues) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  cancelHref: string;
  cancelLabel?: string;
  /** En mode édition, l'image actuelle peut être conservée (pas de nouveau fichier) */
  isEdit?: boolean;
};

const emptyForm: SingleFormValues = {
  title: "",
  youtube_url: "",
  image_url: "",
  display_order: 0,
};

export function SingleForm({
  initialValues,
  onSubmit,
  submitLabel,
  loading = false,
  error = null,
  cancelHref,
  cancelLabel = "Annuler",
  isEdit = false,
}: SingleFormProps) {
  const [form, setForm] = React.useState<SingleFormValues>(() => ({
    ...emptyForm,
    ...initialValues,
    title: initialValues.title ?? "",
    youtube_url: initialValues.youtube_url ?? "",
    image_url: initialValues.image_url ?? "",
    display_order:
      initialValues.display_order !== undefined ? initialValues.display_order : 0,
  }));
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    initialValues.image_url ?? null
  );
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    setForm((prev) => ({ ...prev, image_url: "" })); // sera rempli après upload
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
      // En édition : supprimer l'ancienne image du disque si c'était un fichier local
      if (isEdit && initialValues.image_url?.startsWith("/images/")) {
        await fetch("/api/images/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: initialValues.image_url }),
        });
      }
    }

    if (!imageUrl) {
      setUploadError("Veuillez importer une image ou conserver l’image actuelle.");
      return;
    }

    await onSubmit({ ...form, image_url: imageUrl });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="single-title" className="mb-1 block">
          Titre
        </Label>
        <Input
          id="single-title"
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          placeholder="Titre du single"
        />
      </div>
      <div>
        <Label htmlFor="single-youtube" className="mb-1 block">
          URL YouTube
        </Label>
        <Input
          id="single-youtube"
          type="url"
          value={form.youtube_url}
          onChange={(e) =>
            setForm((f) => ({ ...f, youtube_url: e.target.value }))
          }
          required
          placeholder="https://www.youtube.com/watch?v=…"
        />
      </div>
      <div>
        <Label className="mb-1 block">Image (cover)</Label>
        <div className="space-y-2">
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
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="h-32 w-32 object-cover rounded border border-border"
              />
            </div>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="single-order" className="mb-1 block">
          Ordre d&apos;affichage
        </Label>
        <Input
          id="single-order"
          type="number"
          min={0}
          value={form.display_order}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              display_order: parseInt(e.target.value, 10) || 0,
            }))
          }
          placeholder="0"
        />
      </div>
      {(error || uploadError) && (
        <p className="text-sm text-destructive">{uploadError ?? error}</p>
      )}
      <div className="flex gap-2">
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
