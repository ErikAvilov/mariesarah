"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePress, type PressRow } from "@/lib/press";
import { Button } from "@/components/ui/button";
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

export function AdminPressListClient({
  initialItems,
}: {
  initialItems: PressRow[];
}) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirmDelete(id: string) {
    setDeleting(true);
    const { error: err } = await deletePress(id);
    setDeleting(false);
    if (err) {
      setError(err.message);
      setDeleteId(null);
      return;
    }
    setDeleteId(null);
    setSuccessMessage("Lien supprimé.");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-bebas text-2xl uppercase text-foreground">
          Presse / TV / Radio
        </h1>
        <Button asChild>
          <Link href="/admin/press/new">Ajouter un lien presse</Link>
        </Button>
      </div>

      {successMessage && (
        <p className="mb-4 text-sm text-green-600 dark:text-green-400">
          {successMessage}
        </p>
      )}
      {error && (
        <p className="mb-4 text-sm text-destructive">{error}</p>
      )}

      {initialItems.length === 0 && !error ? (
        <p className="text-muted-foreground py-8">
          Aucun lien.{" "}
          <Link href="/admin/press/new" className="text-primary hover:underline">
            Ajouter un lien presse
          </Link>
        </p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Année</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialItems.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.source}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/press/${row.id}/edit`}>
                          Modifier
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(row.id)}
                      >
                        Supprimer
                      </Button>
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
