import { supabase } from "@/lib/supabase";

/**
 * Tables: albums, album_tracks
 * À créer dans Supabase (SQL Editor) si besoin :
 *
 * create table albums (
 *   id uuid primary key default gen_random_uuid(),
 *   title text not null,
 *   artist_name text not null,
 *   release_type text not null default 'EP',
 *   release_year int not null,
 *   genre text not null default '',
 *   badge_label text not null default '',
 *   cover_image_url text not null,
 *   primary_cta_label text not null default '',
 *   primary_cta_url text not null default '',
 *   secondary_cta_label text not null default '',
 *   secondary_cta_url text not null default '',
 *   display_order int not null default 0,
 *   is_featured boolean not null default false,
 *   created_at timestamptz not null default now()
 * );
 *
 * create table album_tracks (
 *   id uuid primary key default gen_random_uuid(),
 *   album_id uuid not null references albums(id) on delete cascade,
 *   track_number int not null,
 *   title text not null,
 *   created_at timestamptz not null default now()
 * );
 *
 * RLS lecture publique : voir supabase-albums-policies.sql
 */

export interface AlbumRow {
  id: string;
  title: string;
  artist_name: string;
  release_type: string;
  release_year: number;
  genre: string;
  badge_label: string;
  cover_image_url: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
}

export interface AlbumTrackRow {
  id: string;
  album_id: string;
  track_number: number;
  title: string;
  created_at: string;
}

export type AlbumInsert = {
  title: string;
  artist_name: string;
  release_type: string;
  release_year: number;
  genre: string;
  badge_label: string;
  cover_image_url: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  display_order: number;
  is_featured: boolean;
};

export type AlbumUpdate = Partial<AlbumInsert>;

/** Données sérialisables pour la section album mise en avant (page publique) */
export type PublicFeaturedAlbum = {
  id: string;
  badgeLabel: string;
  title: string;
  artistName: string;
  releaseType: string;
  releaseYear: number;
  genre: string;
  coverImageUrl: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  tracks: { trackNumber: number; title: string }[];
};

function mapAlbumRow(row: Record<string, unknown>): AlbumRow {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    artist_name: String(row.artist_name ?? ""),
    release_type: String(row.release_type ?? ""),
    release_year: Number(row.release_year ?? 0),
    genre: String(row.genre ?? ""),
    badge_label: String(row.badge_label ?? ""),
    cover_image_url: String(row.cover_image_url ?? ""),
    primary_cta_label: String(row.primary_cta_label ?? ""),
    primary_cta_url: String(row.primary_cta_url ?? ""),
    secondary_cta_label: String(row.secondary_cta_label ?? ""),
    secondary_cta_url: String(row.secondary_cta_url ?? ""),
    display_order: Number(row.display_order ?? 0),
    is_featured: Boolean(row.is_featured),
    created_at: String(row.created_at ?? ""),
  };
}

/** Album affiché en premier sur le site : is_featured DESC, display_order ASC */
export async function getPublicFeaturedAlbum(): Promise<PublicFeaturedAlbum | null> {
  const { data: albums, error } = await supabase
    .from("albums")
    .select(
      "id, title, artist_name, release_type, release_year, genre, badge_label, cover_image_url, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, display_order, is_featured, created_at"
    )
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true })
    .limit(1);

  if (error) throw error;
  const first = albums?.[0];
  if (!first) return null;

  const row = mapAlbumRow(first as Record<string, unknown>);
  const { data: tracks, error: tErr } = await supabase
    .from("album_tracks")
    .select("track_number, title")
    .eq("album_id", row.id)
    .order("track_number", { ascending: true });

  if (tErr) throw tErr;

  return {
    id: row.id,
    badgeLabel: row.badge_label,
    title: row.title,
    artistName: row.artist_name,
    releaseType: row.release_type,
    releaseYear: row.release_year,
    genre: row.genre,
    coverImageUrl: row.cover_image_url,
    primaryCtaLabel: row.primary_cta_label,
    primaryCtaUrl: row.primary_cta_url,
    secondaryCtaLabel: row.secondary_cta_label,
    secondaryCtaUrl: row.secondary_cta_url,
    tracks: (tracks ?? []).map((t: { track_number: number; title: string }) => ({
      trackNumber: Number(t.track_number),
      title: String(t.title ?? ""),
    })),
  };
}

export async function getAllAlbumsForAdmin(): Promise<AlbumRow[]> {
  const { data, error } = await supabase
    .from("albums")
    .select(
      "id, title, artist_name, release_type, release_year, genre, badge_label, cover_image_url, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, display_order, is_featured, created_at"
    )
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => mapAlbumRow(r as Record<string, unknown>));
}

export async function getAlbumById(id: string): Promise<AlbumRow | null> {
  const { data, error } = await supabase
    .from("albums")
    .select(
      "id, title, artist_name, release_type, release_year, genre, badge_label, cover_image_url, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, display_order, is_featured, created_at"
    )
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return mapAlbumRow(data as Record<string, unknown>);
}

export async function getAlbumTracksByAlbumId(
  albumId: string
): Promise<AlbumTrackRow[]> {
  const { data, error } = await supabase
    .from("album_tracks")
    .select("id, album_id, track_number, title, created_at")
    .eq("album_id", albumId)
    .order("track_number", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AlbumTrackRow[];
}

async function clearFeaturedExceptCurrent(currentId: string): Promise<void> {
  const { error } = await supabase
    .from("albums")
    .update({ is_featured: false })
    .neq("id", currentId);
  if (error) throw error;
}

async function clearAllFeatured(): Promise<void> {
  const { error } = await supabase
    .from("albums")
    .update({ is_featured: false })
    .eq("is_featured", true);
  if (error) throw error;
}

/** Admin: insert ; si mis en avant, les autres perdent le flag */
export async function insertAlbum(
  row: AlbumInsert
): Promise<{ data: { id: string } | null; error: { message: string } | null }> {
  if (row.is_featured) {
    try {
      await clearAllFeatured();
    } catch (e) {
      return {
        data: null,
        error: { message: e instanceof Error ? e.message : "Erreur lors de la mise à jour." },
      };
    }
  }

  const { data, error } = await supabase
    .from("albums")
    .insert({
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
    })
    .select("id")
    .single();

  if (error) return { data: null, error: { message: error.message } };
  return { data: { id: String(data.id) }, error: null };
}

/** Admin: update ; un seul album mis en avant à la fois */
export async function updateAlbum(
  id: string,
  row: AlbumUpdate
): Promise<{ error: { message: string } | null }> {
  if (row.is_featured === true) {
    try {
      await clearFeaturedExceptCurrent(id);
    } catch (e) {
      return {
        error: { message: e instanceof Error ? e.message : "Erreur lors de la mise à jour." },
      };
    }
  }

  const payload: Record<string, unknown> = {};
  if (row.title !== undefined) payload.title = row.title;
  if (row.artist_name !== undefined) payload.artist_name = row.artist_name;
  if (row.release_type !== undefined) payload.release_type = row.release_type;
  if (row.release_year !== undefined) payload.release_year = row.release_year;
  if (row.genre !== undefined) payload.genre = row.genre;
  if (row.badge_label !== undefined) payload.badge_label = row.badge_label;
  if (row.cover_image_url !== undefined) payload.cover_image_url = row.cover_image_url;
  if (row.primary_cta_label !== undefined) payload.primary_cta_label = row.primary_cta_label;
  if (row.primary_cta_url !== undefined) payload.primary_cta_url = row.primary_cta_url;
  if (row.secondary_cta_label !== undefined)
    payload.secondary_cta_label = row.secondary_cta_label;
  if (row.secondary_cta_url !== undefined) payload.secondary_cta_url = row.secondary_cta_url;
  if (row.display_order !== undefined) payload.display_order = row.display_order;
  if (row.is_featured !== undefined) payload.is_featured = row.is_featured;

  const { error } = await supabase.from("albums").update(payload).eq("id", id);
  return { error: error ? { message: error.message } : null };
}

export async function deleteAlbum(
  id: string
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("albums").delete().eq("id", id);
  return { error: error ? { message: error.message } : null };
}

/** Remplace toute la tracklist (simple et fiable) */
export async function replaceAlbumTracks(
  albumId: string,
  tracks: Array<{ track_number: number; title: string }>
): Promise<{ error: { message: string } | null }> {
  const { error: delErr } = await supabase
    .from("album_tracks")
    .delete()
    .eq("album_id", albumId);
  if (delErr) return { error: { message: delErr.message } };

  if (tracks.length === 0) return { error: null };

  const { error } = await supabase.from("album_tracks").insert(
    tracks.map((t) => ({
      album_id: albumId,
      track_number: t.track_number,
      title: t.title,
    }))
  );
  return { error: error ? { message: error.message } : null };
}
