"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  activateSiteModalExclusive,
  deleteSiteModal,
  updateSiteModal,
  type SiteModalRow,
} from "@/lib/site-modals";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function AdminSiteModalsListClient({
  initialItems,
}: {
  initialItems: SiteModalRow[];
}) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleConfirmDelete(id: string) {
    setDeleting(true);
    const { error: err } = await deleteSiteModal(id);
    setDeleting(false);
    if (err) {
      setError(err.message);
      setDeleteId(null);
      return;
    }
    setDeleteId(null);
    setSuccessMessage("Modal supprimé.");
    router.refresh();
  }

  async function handleActivate(id: string) {
    setError(null);
    setPendingId(id);
    const { error: err } = await activateSiteModalExclusive(id);
    setPendingId(null);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccessMessage("Modal activé.");
    router.refresh();
  }

  async function handleDeactivate(id: string) {
    setError(null);
    setPendingId(id);
    const { error: err } = await updateSiteModal(id, { is_active: false });
    setPendingId(null);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccessMessage("Modal désactivé.");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-bebas text-3xl uppercase text-foreground">
          Modals d&apos;accueil
        </h1>
        <Button asChild size="lg" className="gap-2">
          <Link href="/admin/modals/new">
            <Plus className="h-5 w-5" />
            Ajouter un modal
          </Link>
        </Button>
      </div>

      {successMessage && (
        <p className="mb-4 text-sm text-green-600 dark:text-green-400">
          {successMessage}
        </p>
      )}
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {initialItems.length === 0 && !error ? (
        <p className="text-muted-foreground py-8">
          Aucun modal.{" "}
          <Link href="/admin/modals/new" className="text-primary hover:underline">
            Ajouter un modal
          </Link>
        </p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Actif</TableHead>
                <TableHead className="min-w-[280px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialItems.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.title}</TableCell>
                  <TableCell>{row.is_active ? "Oui" : "Non"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/modals/${row.id}/edit`}>Modifier</Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(row.id)}
                      >
                        Supprimer
                      </Button>
                      {!row.is_active ? (
                        <Button
                          size="sm"
                          disabled={pendingId === row.id}
                          onClick={() => handleActivate(row.id)}
                        >
                          Activer
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={pendingId === row.id}
                          onClick={() => handleDeactivate(row.id)}
                        >
                          Désactiver
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce modal ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deleteId) handleConfirmDelete(deleteId);
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
