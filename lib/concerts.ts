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

function isUpcoming(row: ConcertRow): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(row.event_date + "T00:00:00");
  return eventDate >= today || row.is_upcoming === true;
}

export async function getConcerts(): Promise<{
  upcoming: ConcertRow[];
  past: ConcertRow[];
}> {
  try {
    const { data, error } = await supabase
      .from("concerts")
      .select("*");

    console.log("SUPABASE concerts data:", data);

    if (error) {
      console.error("SUPABASE concerts error:", error);
      return { upcoming: [], past: [] };
    }

    if (!data) {
      console.error("Supabase returned no data");
      return { upcoming: [], past: [] };
    }

    const list = data as ConcertRow[];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = list
      .filter((row) => {
        const eventDate = new Date(row.event_date + "T00:00:00");
        return eventDate >= today || row.is_upcoming === true;
      })
      .sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );

    const past = list
      .filter((row) => !isUpcoming(row))
      .sort(
        (a, b) =>
          new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
      );

    return { upcoming, past };
  } catch (err) {
    console.error("Unexpected Supabase fetch error:", err);
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
