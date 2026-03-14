"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { insertSingle, type SingleInsert } from "@/lib/singles";
import { SingleForm } from "@/components/admin/single-form";

export function NewSingleForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: SingleInsert) {
    setError(null);
    setLoading(true);
    const { error: err } = await insertSingle(values);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/admin/singles");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-md mx-auto">
      <h1 className="font-bebas text-2xl uppercase text-foreground mb-6">
        Nouveau single
      </h1>
      <SingleForm
        initialValues={{
          title: "",
          youtube_url: "",
          image_url: "",
          display_order: 0,
        }}
        onSubmit={handleSubmit}
        submitLabel="Ajouter"
        loading={loading}
        error={error}
        cancelHref="/admin/singles"
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
