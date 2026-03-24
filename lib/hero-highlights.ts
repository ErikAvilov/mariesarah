import { supabase } from "@/lib/supabase";

/**
 * Table: hero_highlights
 * create table hero_highlights (
 *   id uuid primary key default gen_random_uuid(),
 *   eyebrow text not null default '',
 *   title text not null,
 *   artist_name text not null default '',
 *   cta_label text not null default '',
 *   target_url text not null,
 *   background_image_url text not null,
 *   is_active boolean not null default false,
 *   display_order int not null default 0,
 *   created_at timestamptz not null default now()
 * );
 *
 * RLS : voir supabase-hero-highlights-policies.sql
 */

export interface HeroHighlightRow {
  id: string;
  eyebrow: string;
  title: string;
  artist_name: string;
  cta_label: string;
  target_url: string;
  background_image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export type ActiveHeroHighlightPayload = {
  /** Présent quand le hero vient de la BDD (édition admin) */
  id?: string;
  eyebrow: string;
  title: string;
  artist_name: string;
  cta_label: string;
  target_url: string;
  background_image_url: string;
};

export type HeroHighlightInsert = {
  eyebrow: string;
  title: string;
  artist_name: string;
  cta_label: string;
  target_url: string;
  background_image_url: string;
  is_active: boolean;
  display_order: number;
};

export type HeroHighlightUpdate = Partial<HeroHighlightInsert>;

async function deactivateAllActive(): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase
    .from("hero_highlights")
    .update({ is_active: false })
    .eq("is_active", true);
  return { error: error ? { message: error.message } : null };
}

async function deactivateOthersThan(id: string): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase
    .from("hero_highlights")
    .update({ is_active: false })
    .neq("id", id);
  return { error: error ? { message: error.message } : null };
}

export async function getActiveHeroHighlight(): Promise<ActiveHeroHighlightPayload | null> {
  const { data, error } = await supabase
    .from("hero_highlights")
    .select(
      "id, eyebrow, title, artist_name, cta_label, target_url, background_image_url"
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const target = String(data.target_url ?? "").trim();
  const bg = String(data.background_image_url ?? "").trim();
  if (!target || !bg) return null;

  return {
    id: String(data.id ?? ""),
    eyebrow: String(data.eyebrow ?? ""),
    title: String(data.title ?? ""),
    artist_name: String(data.artist_name ?? ""),
    cta_label: String(data.cta_label ?? "").trim() || "Écouter",
    target_url: target,
    background_image_url: bg,
  };
}

export async function getAllHeroHighlightsForAdmin(): Promise<HeroHighlightRow[]> {
  const { data, error } = await supabase
    .from("hero_highlights")
    .select(
      "id, eyebrow, title, artist_name, cta_label, target_url, background_image_url, is_active, display_order, created_at"
    )
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as HeroHighlightRow[];
}

export async function getHeroHighlightById(id: string): Promise<HeroHighlightRow | null> {
  const { data, error } = await supabase
    .from("hero_highlights")
    .select(
      "id, eyebrow, title, artist_name, cta_label, target_url, background_image_url, is_active, display_order, created_at"
    )
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as HeroHighlightRow;
}

export async function insertHeroHighlight(
  row: HeroHighlightInsert
): Promise<{ error: { message: string } | null }> {
  if (row.is_active) {
    const { error: dErr } = await deactivateAllActive();
    if (dErr) return { error: dErr };
  }

  const { error } = await supabase.from("hero_highlights").insert({
    eyebrow: row.eyebrow,
    title: row.title,
    artist_name: row.artist_name,
    cta_label: row.cta_label,
    target_url: row.target_url.trim(),
    background_image_url: row.background_image_url.trim(),
    is_active: row.is_active,
    display_order: row.display_order,
  });
  return { error: error ? { message: error.message } : null };
}

export async function updateHeroHighlight(
  id: string,
  row: HeroHighlightUpdate
): Promise<{ error: { message: string } | null }> {
  if (row.is_active === true) {
    const { error: dErr } = await deactivateOthersThan(id);
    if (dErr) return { error: dErr };
  }

  const payload: Record<string, unknown> = {};
  if (row.eyebrow !== undefined) payload.eyebrow = row.eyebrow;
  if (row.title !== undefined) payload.title = row.title;
  if (row.artist_name !== undefined) payload.artist_name = row.artist_name;
  if (row.cta_label !== undefined) payload.cta_label = row.cta_label;
  if (row.target_url !== undefined) payload.target_url = String(row.target_url).trim();
  if (row.background_image_url !== undefined)
    payload.background_image_url = String(row.background_image_url).trim();
  if (row.is_active !== undefined) payload.is_active = row.is_active;
  if (row.display_order !== undefined) payload.display_order = row.display_order;

  const { error } = await supabase.from("hero_highlights").update(payload).eq("id", id);
  return { error: error ? { message: error.message } : null };
}

export async function activateHeroHighlightExclusive(
  id: string
): Promise<{ error: { message: string } | null }> {
  const { error: dErr } = await deactivateAllActive();
  if (dErr) return { error: dErr };
  const { error } = await supabase
    .from("hero_highlights")
    .update({ is_active: true })
    .eq("id", id);
  return { error: error ? { message: error.message } : null };
}

export async function deleteHeroHighlight(
  id: string
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("hero_highlights").delete().eq("id", id);
  return { error: error ? { message: error.message } : null };
}
