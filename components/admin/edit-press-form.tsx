"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  updatePress,
  deletePress,
  type PressRow,
  type PressInsert,
} from "@/lib/press";
import { PressForm } from "@/components/admin/press-form";
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

export function EditPressForm({ item }: { item: PressRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(values: PressInsert) {
    setError(null);
    setLoading(true);
    const { error: err } = await updatePress(item.id, values);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/admin/press");
    router.refresh();
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    const { error: err } = await deletePress(item.id);
    setDeleting(false);
    if (err) {
      setError(err.message);
      setShowDeleteConfirm(false);
      return;
    }
    setShowDeleteConfirm(false);
    router.push("/admin/press");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-md mx-auto">
      <h1 className="font-bebas text-2xl uppercase text-foreground mb-6">
        Modifier le lien presse
      </h1>
      <PressForm
        initialValues={item}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer"
        loading={loading}
        error={error}
        cancelHref="/admin/press"
        cancelLabel="Annuler"
      />
      <div className="mt-8 pt-6 border-t border-border">
        <Button
          variant="destructive"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Supprimer ce lien
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
            <AlertDialogTitle>Supprimer cet élément</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet élément ?
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
