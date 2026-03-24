"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { insertSiteModal } from "@/lib/site-modals";
import { SiteModalForm, type SiteModalFormValues } from "@/components/admin/site-modal-form";

export function NewSiteModalForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: SiteModalFormValues) {
    setError(null);
    setLoading(true);
    const { error: err } = await insertSiteModal({
      title: values.title,
      image_url: values.image_url,
      target_url: values.target_url,
      is_active: values.is_active,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/admin/modals");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-xl mx-auto">
      <h1 className="font-bebas text-2xl uppercase text-foreground mb-6">
        Nouveau modal d&apos;accueil
      </h1>
      <SiteModalForm
        initialValues={{
          title: "",
          image_url: "",
          target_url: null,
          is_active: false,
        }}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer"
        loading={loading}
        error={error}
        cancelHref="/admin/modals"
        cancelLabel="Annuler"
        isEdit={false}
      />
      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-foreground">
          ← Tableau de bord
        </Link>
      </p>
    </div>
  );
}
