import { supabase } from "@/lib/supabase";

export interface ConcertRow {
  id: string;
  event_date: string;
  city: string;
  country: string;
  venue: string;
  ticket_url: string | null;
  ticket_label: string | null;
  is_upcoming: boolean;
  created_at: string;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function eventDayStart(row: ConcertRow): Date {
  return new Date(row.event_date + "T00:00:00");
}

function isUpcomingByEventDate(row: ConcertRow, todayStart: Date): boolean {
  return eventDayStart(row).getTime() >= todayStart.getTime();
}

export async function getConcerts(): Promise<{
  upcoming: ConcertRow[];
  past: ConcertRow[];
}> {
  try {
    const { data, error } = await supabase
      .from("concerts")
      .select("*");

    if (error) {
      return { upcoming: [], past: [] };
    }

    if (!data) {
      return { upcoming: [], past: [] };
    }

    const list = data as ConcertRow[];
    const todayStart = startOfToday();

    const upcoming = list
      .filter((row) => isUpcomingByEventDate(row, todayStart))
      .sort(
        (a, b) => eventDayStart(a).getTime() - eventDayStart(b).getTime()
      );

    const past = list
      .filter((row) => !isUpcomingByEventDate(row, todayStart))
      .sort(
        (a, b) => eventDayStart(b).getTime() - eventDayStart(a).getTime()
      );

    return { upcoming, past };
  } catch {
    return { upcoming: [], past: [] };
  }
}

export type ConcertInsert = {
  event_date: string;
  city: string;
  country: string;
  venue: string;
  ticket_url?: string | null;
  ticket_label?: string | null;
  is_upcoming?: boolean;
};

export type ConcertUpdate = {
  event_date?: string;
  city?: string;
  country?: string;
  venue?: string;
  ticket_url?: string | null;
  ticket_label?: string | null;
  is_upcoming?: boolean;
};

/** Fetch all concerts for admin list, sorted by event_date descending */
export async function getAllConcertsForAdmin(): Promise<ConcertRow[]> {
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .order("event_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ConcertRow[];
}

/** Fetch a single concert by id for edit page */
export async function getConcertById(
  id: string
): Promise<ConcertRow | null> {
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as ConcertRow;
}

export async function insertConcert(
  row: ConcertInsert
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("concerts").insert({
    event_date: row.event_date,
    city: row.city,
    country: row.country,
    venue: row.venue,
    ticket_url: row.ticket_url ?? null,
    ticket_label: row.ticket_label ?? null,
    is_upcoming: row.is_upcoming ?? true,
  });
  return {
    error: error ? { message: error.message } : null,
  };
}

export async function updateConcert(
  id: string,
  row: ConcertUpdate
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase
    .from("concerts")
    .update({
      ...(row.event_date !== undefined && { event_date: row.event_date }),
      ...(row.city !== undefined && { city: row.city }),
      ...(row.country !== undefined && { country: row.country }),
      ...(row.venue !== undefined && { venue: row.venue }),
      ...(row.ticket_url !== undefined && { ticket_url: row.ticket_url ?? null }),
      ...(row.ticket_label !== undefined && {
        ticket_label: row.ticket_label ?? null,
      }),
      ...(row.is_upcoming !== undefined && { is_upcoming: row.is_upcoming }),
    })
    .eq("id", id);
  return {
    error: error ? { message: error.message } : null,
  };
}

export async function deleteConcert(
  id: string
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("concerts").delete().eq("id", id);
  return {
    error: error ? { message: error.message } : null,
  };
}
