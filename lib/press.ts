import { supabase } from "@/lib/supabase";

/** Table attendue : id, created_at, source, title, year, url */
export interface PressRow {
  id: string;
  created_at: string;
  source: string;
  title: string;
  year: string;
  url: string;
}

export type PressInsert = {
  source: string;
  title: string;
  year: string;
  url: string;
};

export type PressUpdate = {
  source?: string;
  title?: string;
  year?: string;
  url?: string;
};

/** Public: fetch all press links for the site, ordered by year desc then created_at desc */
export async function getPressLinks(): Promise<PressRow[]> {
  const { data, error } = await supabase
    .from("press")
    .select("id, created_at, source, title, year, url")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PressRow[];
}

/** Admin: fetch all for list */
export async function getAllPressForAdmin(): Promise<PressRow[]> {
  const { data, error } = await supabase
    .from("press")
    .select("id, created_at, source, title, year, url")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PressRow[];
}

/** Admin: fetch one by id */
export async function getPressById(id: string): Promise<PressRow | null> {
  const { data, error } = await supabase
    .from("press")
    .select("id, created_at, source, title, year, url")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as PressRow;
}

/** Admin: insert */
export async function insertPress(
  row: PressInsert
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("press").insert({
    source: row.source,
    title: row.title,
    year: row.year,
    url: row.url,
  });
  return { error: error ? { message: error.message } : null };
}

/** Admin: update */
export async function updatePress(
  id: string,
  row: PressUpdate
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase
    .from("press")
    .update({
      ...(row.source !== undefined && { source: row.source }),
      ...(row.title !== undefined && { title: row.title }),
      ...(row.year !== undefined && { year: row.year }),
      ...(row.url !== undefined && { url: row.url }),
    })
    .eq("id", id);
  return { error: error ? { message: error.message } : null };
}

/** Admin: delete */
export async function deletePress(
  id: string
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("press").delete().eq("id", id);
  return { error: error ? { message: error.message } : null };
}
