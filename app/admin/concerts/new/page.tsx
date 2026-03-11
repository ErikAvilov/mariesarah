"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { insertConcert, type ConcertInsert } from "@/lib/concerts";
import { ConcertForm } from "@/components/admin/concert-form";

export default function AdminNewConcertPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: ConcertInsert) {
    setError(null);
    setLoading(true);
    const { error: err } = await insertConcert({
      ...values,
      ticket_url: values.ticket_url || null,
      ticket_label: values.ticket_label || null,
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
        Nouveau concert
      </h1>
      <ConcertForm
        initialValues={{
          event_date: "",
          city: "",
          country: "",
          venue: "",
          ticket_url: "",
          ticket_label: "",
          is_upcoming: true,
        }}
        onSubmit={handleSubmit}
        submitLabel="Ajouter"
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
