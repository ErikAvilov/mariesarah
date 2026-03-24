"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteAlbum, type AlbumRow } from "@/lib/albums";
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";
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

export function AdminAlbumsListClient({
  initialItems,
}: {
  initialItems: AlbumRow[];
}) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirmDelete(id: string) {
    setDeleting(true);
    const { error: err } = await deleteAlbum(id);
    setDeleting(false);
    if (err) {
      setError(err.message);
      setDeleteId(null);
      return;
    }
    setDeleteId(null);
    setSuccessMessage("Album supprimé.");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-bebas text-3xl uppercase text-foreground">
          Albums / EP
        </h1>
        <Button asChild size="lg" className="gap-2">
          <Link href="/admin/albums/new">
            <Plus className="h-5 w-5" />
            Ajouter un album
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
          Aucun album.{" "}
          <Link href="/admin/albums/new" className="text-primary hover:underline">
            Ajouter un album
          </Link>
        </p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" aria-label="Mis en avant" />
                <TableHead>Titre</TableHead>
                <TableHead>Artiste</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead className="w-[220px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialItems.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {row.is_featured ? (
                      <Star
                        className="h-5 w-5 text-primary fill-primary"
                        aria-label="Mis en avant"
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{row.title}</TableCell>
                  <TableCell>{row.artist_name}</TableCell>
                  <TableCell>{row.release_type}</TableCell>
                  <TableCell>{row.display_order}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/albums/${row.id}/edit`}>Modifier</Link>
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
            <AlertDialogTitle>Supprimer l&apos;album</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet album ?
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
