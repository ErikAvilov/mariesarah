"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getConcertById, updateConcert, type ConcertRow, type ConcertInsert } from "@/lib/concerts";
import { ConcertForm } from "@/components/admin/concert-form";

export default function AdminEditConcertPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [concert, setConcert] = useState<ConcertRow | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingPage(true);
    setLoadError(null);
    getConcertById(id)
      .then((data) => {
        if (!cancelled) setConcert(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Erreur");
      })
      .finally(() => {
        if (!cancelled) setLoadingPage(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(values: ConcertInsert) {
    setError(null);
    setLoading(true);
    const { error: err } = await updateConcert(id, {
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

  if (loadingPage) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (loadError || !concert) {
    return (
      <div className="p-4 lg:p-8 max-w-md mx-auto">
        <p className="text-destructive mb-4">
          {loadError ?? "Concert introuvable."}
        </p>
        <Link
          href="/admin/concerts"
          className="text-sm text-primary hover:underline"
        >
          ← Retour à la liste
        </Link>
      </div>
    );
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
