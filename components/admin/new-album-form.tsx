"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  insertAlbum,
  replaceAlbumTracks,
  type AlbumInsert,
} from "@/lib/albums";
import { AlbumForm } from "@/components/admin/album-form";

export function NewAlbumForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    album: AlbumInsert,
    tracks: Array<{ track_number: number; title: string }>
  ) {
    setError(null);
    setLoading(true);
    const { data, error: insErr } = await insertAlbum(album);
    if (insErr || !data) {
      setLoading(false);
      setError(insErr?.message ?? "Impossible de créer l’album.");
      return;
    }
    const { error: trErr } = await replaceAlbumTracks(data.id, tracks);
    setLoading(false);
    if (trErr) {
      setError(trErr.message);
      return;
    }
    router.push("/admin/albums");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <h1 className="font-bebas text-2xl uppercase text-foreground mb-6">
        Nouvel album / EP
      </h1>
      <AlbumForm
        initialAlbum={null}
        initialTracks={[]}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer"
        loading={loading}
        error={error}
        cancelHref="/admin/albums"
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
