"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  updateSingle,
  deleteSingleWithImage,
  type SingleRow,
  type SingleInsert,
} from "@/lib/singles";
import { SingleForm } from "@/components/admin/single-form";
import { removePreviousAdminImage } from "@/lib/storage-media";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function EditSingleForm({ item }: { item: SingleRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(values: SingleInsert) {
    setError(null);
    setLoading(true);
    const { error: err } = await updateSingle(item.id, values);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/admin/singles");
    router.refresh();
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    await removePreviousAdminImage(item.image_url);
    const { error: err } = await deleteSingleWithImage(item.id);
    setDeleting(false);
    if (err) {
      setError(err.message);
      setShowDeleteConfirm(false);
      return;
    }
    setShowDeleteConfirm(false);
    router.push("/admin/singles");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-md mx-auto">
      <h1 className="font-bebas text-2xl uppercase text-foreground mb-6">
        Modifier le single
      </h1>
      <SingleForm
        initialValues={item}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer"
        loading={loading}
        error={error}
        cancelHref="/admin/singles"
        cancelLabel="Annuler"
        isEdit
      />
      <div className="mt-8 pt-6 border-t border-border">
        <Button
          variant="destructive"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Supprimer ce single
        </Button>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-foreground">
          ← Tableau de bord
        </Link>
      </p>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce single</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce single ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
