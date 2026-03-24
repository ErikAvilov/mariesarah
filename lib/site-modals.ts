import { supabase } from "@/lib/supabase";

/**
 * Table: site_modals
 * create table site_modals (
 *   id uuid primary key default gen_random_uuid(),
 *   title text not null,
 *   image_url text not null,
 *   target_url text,
 *   is_active boolean not null default false,
 *   display_order int not null default 0,
 *   created_at timestamptz not null default now()
 * );
 *
 * RLS : voir supabase-site-modals-policies.sql
 */

export interface SiteModalRow {
  id: string;
  title: string;
  image_url: string;
  target_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

/** Données passées au composant modal sur l’accueil */
export type ActiveSiteModalPayload = {
  title: string;
  image_url: string;
  target_url: string | null;
};

export type SiteModalInsert = {
  title: string;
  image_url: string;
  target_url: string | null;
  is_active: boolean;
  display_order?: number;
};

export type SiteModalUpdate = {
  title?: string;
  image_url?: string;
  target_url?: string | null;
  is_active?: boolean;
  display_order?: number;
};

async function deactivateAllActive(): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase
    .from("site_modals")
    .update({ is_active: false })
    .eq("is_active", true);
  return { error: error ? { message: error.message } : null };
}

async function deactivateOthersThan(id: string): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase
    .from("site_modals")
    .update({ is_active: false })
    .neq("id", id);
  return { error: error ? { message: error.message } : null };
}

/** Public : un seul modal actif, priorité display_order puis created_at */
export async function getActiveSiteModal(): Promise<ActiveSiteModalPayload | null> {
  const { data, error } = await supabase
    .from("site_modals")
    .select("title, image_url, target_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return {
    title: String(data.title ?? ""),
    image_url: String(data.image_url ?? ""),
    target_url:
      data.target_url != null && String(data.target_url).trim() !== ""
        ? String(data.target_url).trim()
        : null,
  };
}

export async function getAllSiteModalsForAdmin(): Promise<SiteModalRow[]> {
  const { data, error } = await supabase
    .from("site_modals")
    .select("id, title, image_url, target_url, is_active, display_order, created_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SiteModalRow[];
}

export async function getSiteModalById(id: string): Promise<SiteModalRow | null> {
  const { data, error } = await supabase
    .from("site_modals")
    .select("id, title, image_url, target_url, is_active, display_order, created_at")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as SiteModalRow;
}

export async function insertSiteModal(
  row: SiteModalInsert
): Promise<{ error: { message: string } | null }> {
  if (row.is_active) {
    const { error: dErr } = await deactivateAllActive();
    if (dErr) return { error: dErr };
  }

  const { error } = await supabase.from("site_modals").insert({
    title: row.title,
    image_url: row.image_url,
    target_url: row.target_url?.trim() ? row.target_url.trim() : null,
    is_active: row.is_active,
    display_order: row.display_order ?? 0,
  });
  return { error: error ? { message: error.message } : null };
}

export async function updateSiteModal(
  id: string,
  row: SiteModalUpdate
): Promise<{ error: { message: string } | null }> {
  if (row.is_active === true) {
    const { error: dErr } = await deactivateOthersThan(id);
    if (dErr) return { error: dErr };
  }

  const payload: Record<string, unknown> = {};
  if (row.title !== undefined) payload.title = row.title;
  if (row.image_url !== undefined) payload.image_url = row.image_url;
  if (row.target_url !== undefined) {
    payload.target_url =
      row.target_url != null && String(row.target_url).trim() !== ""
        ? String(row.target_url).trim()
        : null;
  }
  if (row.is_active !== undefined) payload.is_active = row.is_active;
  if (row.display_order !== undefined) payload.display_order = row.display_order;

  const { error } = await supabase.from("site_modals").update(payload).eq("id", id);
  return { error: error ? { message: error.message } : null };
}

/** Liste admin : activer ce modal, désactiver tous les autres */
export async function activateSiteModalExclusive(
  id: string
): Promise<{ error: { message: string } | null }> {
  const { error: dErr } = await deactivateAllActive();
  if (dErr) return { error: dErr };
  const { error } = await supabase.from("site_modals").update({ is_active: true }).eq("id", id);
  return { error: error ? { message: error.message } : null };
}

export async function deleteSiteModal(
  id: string
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("site_modals").delete().eq("id", id);
  return { error: error ? { message: error.message } : null };
}
