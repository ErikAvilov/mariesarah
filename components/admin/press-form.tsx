"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { PressRow, PressInsert } from "@/lib/press";

type PressFormValues = PressInsert;

type PressFormProps = {
  initialValues: Partial<PressRow> & Pick<PressInsert, "source" | "title" | "year" | "url">;
  onSubmit: (values: PressFormValues) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
  error?: string | null;
  cancelHref: string;
  cancelLabel?: string;
};

const emptyForm: PressFormValues = {
  source: "",
  title: "",
  year: "",
  url: "",
};

export function PressForm({
  initialValues,
  onSubmit,
  submitLabel,
  loading = false,
  error = null,
  cancelHref,
  cancelLabel = "Annuler",
}: PressFormProps) {
  const [form, setForm] = React.useState<PressFormValues>(() => ({
    ...emptyForm,
    ...initialValues,
    source: initialValues.source ?? "",
    title: initialValues.title ?? "",
    year: initialValues.year ?? "",
    url: initialValues.url ?? "",
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="press-source" className="mb-1 block">
          Source (ex. Europe 1, Taratata)
        </Label>
        <Input
          id="press-source"
          type="text"
          value={form.source}
          onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
          required
          placeholder="Nom du média"
        />
      </div>
      <div>
        <Label htmlFor="press-title" className="mb-1 block">
          Titre
        </Label>
        <Input
          id="press-title"
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          placeholder="Titre de l'article ou de l'émission"
        />
      </div>
      <div>
        <Label htmlFor="press-year" className="mb-1 block">
          Année
        </Label>
        <Input
          id="press-year"
          type="text"
          value={form.year}
          onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
          required
          placeholder="ex. 2025"
        />
      </div>
      <div>
        <Label htmlFor="press-url" className="mb-1 block">
          URL
        </Label>
        <Input
          id="press-url"
          type="url"
          value={form.url}
          onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          required
          placeholder="https://…"
        />
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
