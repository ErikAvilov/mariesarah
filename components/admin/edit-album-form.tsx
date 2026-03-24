"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  updateAlbum,
  replaceAlbumTracks,
  type AlbumRow,
  type AlbumInsert,
  type AlbumTrackRow,
} from "@/lib/albums";
import { AlbumForm, rowToInsert, tracksFromRows } from "@/components/admin/album-form";

function mapDbTracks(rows: AlbumTrackRow[]) {
  return tracksFromRows(
    rows.map((r) => ({ track_number: r.track_number, title: r.title }))
  );
}

export function EditAlbumForm({
  item,
  tracks: initialTrackRows,
}: {
  item: AlbumRow;
  tracks: AlbumTrackRow[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    album: AlbumInsert,
    trackPayload: Array<{ track_number: number; title: string }>
  ) {
    setError(null);
    setLoading(true);
    const { error: upErr } = await updateAlbum(item.id, album);
    if (upErr) {
      setLoading(false);
      setError(upErr.message);
      return;
    }
    const { error: trErr } = await replaceAlbumTracks(item.id, trackPayload);
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
        Modifier l&apos;album
      </h1>
      <AlbumForm
        initialAlbum={rowToInsert(item)}
        initialTracks={mapDbTracks(initialTrackRows)}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer"
        loading={loading}
        error={error}
        cancelHref="/admin/albums"
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
