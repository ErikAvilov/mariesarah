"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ConcertInsert, ConcertRow } from "@/lib/concerts";

export type ConcertFormValues = ConcertInsert;

type ConcertFormProps = {
  initialValues: Partial<ConcertRow> & Pick<ConcertRow, "event_date" | "city" | "country" | "venue">;
  onSubmit: (values: ConcertFormValues) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  cancelHref: string;
  cancelLabel?: string;
};

const emptyForm: ConcertFormValues = {
  event_date: "",
  city: "",
  country: "",
  venue: "",
  ticket_url: "",
  ticket_label: "",
  is_upcoming: true,
};

export function ConcertForm({
  initialValues,
  onSubmit,
  submitLabel,
  loading = false,
  error = null,
  cancelHref,
  cancelLabel = "Annuler",
}: ConcertFormProps) {
  const [form, setForm] = React.useState<ConcertFormValues>(() => ({
    ...emptyForm,
    ...initialValues,
    event_date: initialValues.event_date ?? "",
    city: initialValues.city ?? "",
    country: initialValues.country ?? "",
    venue: initialValues.venue ?? "",
    ticket_url: initialValues.ticket_url ?? "",
    ticket_label: initialValues.ticket_label ?? "",
    is_upcoming: initialValues.is_upcoming ?? true,
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      ...form,
      ticket_url: form.ticket_url || null,
      ticket_label: form.ticket_label || null,
    });
  }

  return (
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
      <div className="flex items-center gap-2">
        <Checkbox
          id="is_upcoming"
          checked={form.is_upcoming ?? true}
          onCheckedChange={(checked) =>
            setForm((f) => ({ ...f, is_upcoming: checked === true }))
          }
        />
        <label
          htmlFor="is_upcoming"
          className="text-sm font-medium text-foreground cursor-pointer"
        >
          À venir
        </label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Envoi…" : submitLabel}
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href={cancelHref}>{cancelLabel}</a>
        </Button>
      </div>
    </form>
  );
}
