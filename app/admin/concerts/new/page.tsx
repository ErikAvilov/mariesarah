"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { insertConcert, type ConcertInsert } from "@/lib/concerts";
import { Button } from "@/components/ui/button";

export default function AdminNewConcertPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ConcertInsert>({
    event_date: "",
    city: "",
    country: "",
    venue: "",
    ticket_url: "",
    ticket_label: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      setAuthChecked(true);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await insertConcert({
      ...form,
      ticket_url: form.ticket_url || null,
      ticket_label: form.ticket_label || null,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess(true);
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <p className="text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-foreground font-medium">
            Concert ajouté avec succès.
          </p>
          <div className="flex gap-2 justify-center">
            <Button asChild>
              <Link href="/admin/concerts/new">Ajouter un autre</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/#tour">Voir les concerts</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card p-4 lg:p-8">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="font-bebas text-2xl uppercase text-foreground">
          Nouveau concert
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="event_date"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Date (YYYY-MM-DD)
            </label>
            <input
              id="event_date"
              type="date"
              value={form.event_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, event_date: e.target.value }))
              }
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Ville
            </label>
            <input
              id="city"
              type="text"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Pays
            </label>
            <input
              id="country"
              type="text"
              value={form.country}
              onChange={(e) =>
                setForm((f) => ({ ...f, country: e.target.value }))
              }
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="venue"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Lieu / Salle
            </label>
            <input
              id="venue"
              type="text"
              value={form.venue}
              onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="ticket_url"
              className="block text-sm font-medium text-foreground mb-1"
            >
              URL billetterie (optionnel)
            </label>
            <input
              id="ticket_url"
              type="url"
              value={form.ticket_url ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, ticket_url: e.target.value }))
              }
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="ticket_label"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Libellé billetterie (optionnel, ex. « Billetterie »)
            </label>
            <input
              id="ticket_label"
              type="text"
              value={form.ticket_label ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, ticket_label: e.target.value }))
              }
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Envoi…" : "Ajouter le concert"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/#tour">Annuler</Link>
            </Button>
          </div>
        </form>
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}
