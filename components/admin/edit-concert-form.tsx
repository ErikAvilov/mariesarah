"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateConcert, type ConcertRow, type ConcertInsert } from "@/lib/concerts";
import { ConcertForm } from "@/components/admin/concert-form";

export function EditConcertForm({ concert }: { concert: ConcertRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: ConcertInsert) {
    setError(null);
    setLoading(true);
    const { error: err } = await updateConcert(concert.id, {
      event_date: values.event_date,
      city: values.city,
      country: values.country,
      venue: values.venue,
      ticket_url: values.ticket_url ?? null,
      ticket_label: values.ticket_label ?? null,
      is_upcoming: values.is_upcoming,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/admin/concerts");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-md mx-auto">
      <h1 className="font-bebas text-2xl uppercase text-foreground mb-6">
        Modifier le concert
      </h1>
      <ConcertForm
        initialValues={concert}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer"
        loading={loading}
        error={error}
        cancelHref="/admin/concerts"
        cancelLabel="Annuler"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          ← Retour au site
        </Link>
      </p>
    </div>
  );
}
