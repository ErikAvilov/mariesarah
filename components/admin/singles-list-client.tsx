"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteSingleWithImage, type SingleRow } from "@/lib/singles";
import { removePreviousAdminImage } from "@/lib/storage-media";
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
import { Pencil, Trash2, Plus } from "lucide-react";

export function AdminSinglesListClient({
  initialItems,
}: {
  initialItems: SingleRow[];
}) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirmDelete(id: string) {
    setDeleting(true);
    const row = initialItems.find((s) => s.id === id);
    await removePreviousAdminImage(row?.image_url);
    const { error: err } = await deleteSingleWithImage(id);
    setDeleting(false);
    if (err) {
      setError(err.message);
      setDeleteId(null);
      return;
    }
    setDeleteId(null);
    setSuccessMessage("Single supprimé.");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-bebas text-3xl uppercase text-foreground">
          Singles
        </h1>
        <Button asChild size="lg" className="gap-2">
          <Link href="/admin/singles/new">
            <Plus className="h-5 w-5" />
            Ajouter un single
          </Link>
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
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground mb-6">Aucun single.</p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/admin/singles/new">
              <Plus className="h-5 w-5" />
              Ajouter un single
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordre</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead className="hidden sm:table-cell">URL YouTube</TableHead>
                <TableHead className="w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialItems.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-muted-foreground">
                    {row.display_order}
                  </TableCell>
                  <TableCell className="font-medium">{row.title}</TableCell>
                  <TableCell className="hidden sm:table-cell max-w-[200px] truncate text-muted-foreground text-sm">
                    {row.youtube_url}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" aria-label={`Modifier ${row.title}`}>
                        <Link href={`/admin/singles/${row.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(row.id)}
                        aria-label={`Supprimer ${row.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
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
