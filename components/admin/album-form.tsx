"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { AlbumInsert, AlbumRow } from "@/lib/albums";
import { isManagedImageUrl } from "@/lib/managed-image-url";

export type TrackLine = { key: string; track_number: number; title: string };

function newKey() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `k-${Date.now()}-${Math.random()}`;
}

function defaultTracks(): TrackLine[] {
  return [{ key: newKey(), track_number: 1, title: "" }];
}

function emptyAlbum(): AlbumInsert {
  return {
    title: "",
    artist_name: "",
    release_type: "EP",
    release_year: new Date().getFullYear(),
    genre: "",
    badge_label: "",
    cover_image_url: "",
    primary_cta_label: "Écouter",
    primary_cta_url: "",
    secondary_cta_label: "Toutes les plateformes",
    secondary_cta_url: "",
    display_order: 0,
    is_featured: false,
  };
}

export function rowToInsert(row: AlbumRow): AlbumInsert {
  return {
    title: row.title,
    artist_name: row.artist_name,
    release_type: row.release_type,
    release_year: row.release_year,
    genre: row.genre,
    badge_label: row.badge_label,
    cover_image_url: row.cover_image_url,
    primary_cta_label: row.primary_cta_label,
    primary_cta_url: row.primary_cta_url,
    secondary_cta_label: row.secondary_cta_label,
    secondary_cta_url: row.secondary_cta_url,
    display_order: row.display_order,
    is_featured: row.is_featured,
  };
}

function normalizeTracksForSave(lines: TrackLine[]): Array<{ track_number: number; title: string }> {
  return lines
    .filter((l) => l.title.trim() !== "")
    .map((l) => ({
      track_number: Math.max(0, Number(l.track_number) || 0),
      title: l.title.trim(),
    }))
    .sort((a, b) => a.track_number - b.track_number);
}

type AlbumFormProps = {
  initialAlbum: AlbumInsert | null;
  initialTracks: TrackLine[];
  onSubmit: (
    album: AlbumInsert,
    tracks: Array<{ track_number: number; title: string }>
  ) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  cancelHref: string;
  cancelLabel?: string;
  isEdit?: boolean;
};

export function AlbumForm({
  initialAlbum,
  initialTracks,
  onSubmit,
  submitLabel,
  loading = false,
  error = null,
  cancelHref,
  cancelLabel = "Annuler",
  isEdit = false,
}: AlbumFormProps) {
  const base = initialAlbum ?? emptyAlbum();
  const [form, setForm] = React.useState<AlbumInsert>(() => ({ ...base }));
  const [tracks, setTracks] = React.useState<TrackLine[]>(() =>
    initialTracks.length > 0 ? initialTracks : defaultTracks()
  );
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    base.cover_image_url || null
  );
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setUploadError(null);
    if (!f) {
      setImageFile(null);
      if (isEdit && initialAlbum?.cover_image_url) {
        setImagePreview(initialAlbum.cover_image_url);
        setForm((prev) => ({ ...prev, cover_image_url: initialAlbum.cover_image_url }));
      } else {
        setImagePreview(null);
        setForm((prev) => ({ ...prev, cover_image_url: "" }));
      }
      return;
    }
    if (!f.type.startsWith("image/")) {
      setUploadError("Veuillez choisir une image (JPEG, PNG, WebP ou GIF).");
      return;
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
    setForm((prev) => ({ ...prev, cover_image_url: "" }));
  };

  function addTrack() {
    const nextNum =
      tracks.length === 0
        ? 1
        : Math.max(...tracks.map((t) => t.track_number)) + 1;
    setTracks((prev) => [...prev, { key: newKey(), track_number: nextNum, title: "" }]);
  }

  function removeTrack(key: string) {
    setTracks((prev) => (prev.length <= 1 ? prev : prev.filter((t) => t.key !== key)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);

    let coverUrl = form.cover_image_url;

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
      coverUrl = data.url;
      const previousCover = initialAlbum?.cover_image_url;
      if (isEdit && isManagedImageUrl(previousCover)) {
        await fetch("/api/images/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: previousCover }),
        });
      }
    }

    if (!coverUrl?.trim()) {
      setUploadError("Indiquez une URL de cover ou importez une image.");
      return;
    }

    const normalized = normalizeTracksForSave(tracks);
    if (normalized.length === 0) {
      setUploadError("Ajoutez au moins une piste avec un titre.");
      return;
    }

    await onSubmit({ ...form, cover_image_url: coverUrl }, normalized);
  }

  const sortedForDisplay = [...tracks].sort(
    (a, b) => a.track_number - b.track_number || a.title.localeCompare(b.title)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="album-title" className="mb-1 block">
            Titre
          </Label>
          <Input
            id="album-title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            placeholder="Nom de l’album / EP"
          />
        </div>
        <div>
          <Label htmlFor="album-artist" className="mb-1 block">
            Artiste
          </Label>
          <Input
            id="album-artist"
            value={form.artist_name}
            onChange={(e) => setForm((f) => ({ ...f, artist_name: e.target.value }))}
            required
            placeholder="Marie Sarah"
          />
        </div>
        <div>
          <Label htmlFor="album-release-type" className="mb-1 block">
            Type de sortie
          </Label>
          <Input
            id="album-release-type"
            value={form.release_type}
            onChange={(e) => setForm((f) => ({ ...f, release_type: e.target.value }))}
            required
            placeholder="EP, Album…"
          />
        </div>
        <div>
          <Label htmlFor="album-year" className="mb-1 block">
            Année
          </Label>
          <Input
            id="album-year"
            type="number"
            min={1900}
            max={2100}
            value={form.release_year}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                release_year: parseInt(e.target.value, 10) || f.release_year,
              }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="album-genre" className="mb-1 block">
            Genre
          </Label>
          <Input
            id="album-genre"
            value={form.genre}
            onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
            placeholder="Pop / Soul"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="album-badge" className="mb-1 block">
            Texte du badge
          </Label>
          <Input
            id="album-badge"
            value={form.badge_label}
            onChange={(e) => setForm((f) => ({ ...f, badge_label: e.target.value }))}
            placeholder="Laisser vide pour « Premier EP » sur le site"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="album-cover-url" className="mb-1 block">
          URL de la cover
        </Label>
        <Input
          id="album-cover-url"
          type="text"
          value={form.cover_image_url}
          onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
          placeholder="https://… ou importez un fichier ci-dessous"
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
          {isEdit && form.cover_image_url && !imageFile && (
            <p className="text-sm text-muted-foreground">
              Cover actuelle conservée. Choisir un fichier pour la remplacer.
            </p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Aperçu cover"
              className="h-40 w-40 object-cover rounded-lg border border-border"
            />
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="album-primary-label" className="mb-1 block">
            Libellé bouton principal
          </Label>
          <Input
            id="album-primary-label"
            value={form.primary_cta_label}
            onChange={(e) => setForm((f) => ({ ...f, primary_cta_label: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="album-primary-url" className="mb-1 block">
            URL bouton principal
          </Label>
          <Input
            id="album-primary-url"
            type="url"
            value={form.primary_cta_url}
            onChange={(e) => setForm((f) => ({ ...f, primary_cta_url: e.target.value }))}
            placeholder="https://…"
          />
        </div>
        <div>
          <Label htmlFor="album-secondary-label" className="mb-1 block">
            Libellé bouton secondaire
          </Label>
          <Input
            id="album-secondary-label"
            value={form.secondary_cta_label}
            onChange={(e) =>
              setForm((f) => ({ ...f, secondary_cta_label: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="album-secondary-url" className="mb-1 block">
            URL bouton secondaire
          </Label>
          <Input
            id="album-secondary-url"
            type="url"
            value={form.secondary_cta_url}
            onChange={(e) =>
              setForm((f) => ({ ...f, secondary_cta_url: e.target.value }))
            }
            placeholder="https://…"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div>
          <Label htmlFor="album-order" className="mb-1 block">
            Ordre d&apos;affichage
          </Label>
          <Input
            id="album-order"
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
        <div className="flex items-center gap-2 pb-2">
          <Checkbox
            id="album-featured"
            checked={form.is_featured}
            onCheckedChange={(v) =>
              setForm((f) => ({ ...f, is_featured: v === true }))
            }
          />
          <Label htmlFor="album-featured" className="text-sm font-normal cursor-pointer">
            Mettre en avant sur la page d&apos;accueil
          </Label>
        </div>
      </div>

      <div className="border border-border rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="font-bebas text-xl uppercase text-foreground">Pistes</h2>
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addTrack}>
            <Plus className="h-4 w-4" />
            Ajouter une piste
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Trie par numéro de piste. Seules les lignes avec un titre sont enregistrées.
        </p>
        <ul className="space-y-3">
          {sortedForDisplay.map((line) => (
            <li
              key={line.key}
              className="flex flex-col sm:flex-row gap-2 sm:items-center border border-border/60 rounded-md p-3 bg-muted/20"
            >
              <div className="flex items-center gap-2 shrink-0">
                <Label className="sr-only">N°</Label>
                <Input
                  type="number"
                  min={1}
                  className="w-20"
                  value={line.track_number}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10) || 1;
                    setTracks((prev) =>
                      prev.map((t) =>
                        t.key === line.key ? { ...t, track_number: n } : t
                      )
                    );
                  }}
                  aria-label="Numéro de piste"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Label className="sr-only">Titre de la piste</Label>
                <Input
                  value={line.title}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTracks((prev) =>
                      prev.map((t) => (t.key === line.key ? { ...t, title: v } : t))
                    );
                  }}
                  placeholder="Titre"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive shrink-0"
                onClick={() => removeTrack(line.key)}
                aria-label="Supprimer la piste"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
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

export function tracksFromRows(
  rows: Array<{ track_number: number; title: string }>
): TrackLine[] {
  return rows.map((r) => ({
    key: newKey(),
    track_number: r.track_number,
    title: r.title,
  }));
}
