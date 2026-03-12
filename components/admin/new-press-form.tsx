"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { insertPress, type PressInsert } from "@/lib/press";
import { PressForm } from "@/components/admin/press-form";

export function NewPressForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: PressInsert) {
    setError(null);
    setLoading(true);
    const { error: err } = await insertPress(values);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/admin/press");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-md mx-auto">
      <h1 className="font-bebas text-2xl uppercase text-foreground mb-6">
        Nouveau lien presse
      </h1>
      <PressForm
        initialValues={{
          source: "",
          title: "",
          year: "",
          url: "",
        }}
        onSubmit={handleSubmit}
        submitLabel="Ajouter"
        loading={loading}
        error={error}
        cancelHref="/admin/press"
        cancelLabel="Annuler"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-foreground">
          ← Tableau de bord
        </Link>
      </p>
    </div>
  );
}
