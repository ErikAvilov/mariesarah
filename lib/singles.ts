import { supabase } from "@/lib/supabase";

/**
 * Table: singles
 * Create in Supabase SQL editor if needed:
 *   create table singles (
 *     id uuid primary key default gen_random_uuid(),
 *     title text not null,
 *     youtube_url text not null,
 *     image_url text not null,
 *     display_order int not null default 0,
 *     created_at timestamptz not null default now()
 *   );
 *
 * If the table exists but the site shows an empty section, enable public read access:
 *   alter table singles enable row level security;
 *   create policy "Public can read singles" on singles for select using (true);
 */
export interface SingleRow {
  id: string;
  title: string;
  youtube_url: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export type SingleInsert = {
  title: string;
  youtube_url: string;
  image_url: string;
  display_order: number;
};

export type SingleUpdate = {
  title?: string;
  youtube_url?: string;
  image_url?: string;
  display_order?: number;
};

/** Fetch all singles for the site, ordered by display_order ASC */
export async function getSingles(): Promise<SingleRow[]> {
  const { data, error } = await supabase
    .from("singles")
    .select("id, title, youtube_url, image_url, display_order, created_at")
    .order("display_order", { ascending: true })
    .limit(500);

  if (error) throw error;
  // Objets sérialisables pour le passage Server → Client
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: String(row.id),
    title: String(row.title),
    youtube_url: String(row.youtube_url ?? ""),
    image_url: String(row.image_url ?? ""),
    display_order: Number(row.display_order ?? 0),
    created_at: String(row.created_at ?? ""),
  })) as SingleRow[];
}

/** Admin: fetch all for list */
export async function getAllSinglesForAdmin(): Promise<SingleRow[]> {
  const { data, error } = await supabase
    .from("singles")
    .select("id, title, youtube_url, image_url, display_order, created_at")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SingleRow[];
}

/** Admin: fetch one by id */
export async function getSingleById(id: string): Promise<SingleRow | null> {
  const { data, error } = await supabase
    .from("singles")
    .select("id, title, youtube_url, image_url, display_order, created_at")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as SingleRow;
}

/** Admin: insert */
export async function insertSingle(
  row: SingleInsert
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("singles").insert({
    title: row.title,
    youtube_url: row.youtube_url,
    image_url: row.image_url,
    display_order: row.display_order,
  });
  return { error: error ? { message: error.message } : null };
}

/** Admin: update */
export async function updateSingle(
  id: string,
  row: SingleUpdate
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase
    .from("singles")
    .update({
      ...(row.title !== undefined && { title: row.title }),
      ...(row.youtube_url !== undefined && { youtube_url: row.youtube_url }),
      ...(row.image_url !== undefined && { image_url: row.image_url }),
      ...(row.display_order !== undefined && {
        display_order: row.display_order,
      }),
    })
    .eq("id", id);
  return { error: error ? { message: error.message } : null };
}

/** Admin: delete (base uniquement) */
export async function deleteSingle(
  id: string
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("singles").delete().eq("id", id);
  return { error: error ? { message: error.message } : null };
}

/** Admin: delete single + supprime l'image dans public/images si l'URL est locale */
export async function deleteSingleWithImage(
  id: string
): Promise<{ error: { message: string } | null }> {
  try {
    const res = await fetch("/api/singles/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      return { error: { message: data.error ?? "Erreur lors de la suppression." } };
    }
    return { error: null };
  } catch (e) {
    return {
      error: { message: e instanceof Error ? e.message : "Erreur lors de la suppression." },
    };
  }
}

/** Extract YouTube video ID from URL (embed, watch, youtu.be) */
export function getYoutubeVideoId(url: string): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  return null;
}
