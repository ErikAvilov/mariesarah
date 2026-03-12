"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteConcert, type ConcertRow } from "@/lib/concerts";
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

function formatDate(dateString: string) {
  return new Date(dateString + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function AdminConcertsListClient({
  initialConcerts,
}: {
  initialConcerts: ConcertRow[];
}) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirmDelete(id: string) {
    setDeleting(true);
    const { error: err } = await deleteConcert(id);
    setDeleting(false);
    if (err) {
      setError(err.message);
      setDeleteId(null);
      return;
    }
    setDeleteId(null);
    setSuccessMessage("Concert supprimé.");
    router.refresh();
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-bebas text-2xl uppercase text-foreground">
          Concerts
        </h1>
        <Button asChild>
          <Link href="/admin/concerts/new">Ajouter un concert</Link>
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

      {initialConcerts.length === 0 && !error ? (
        <p className="text-muted-foreground py-8">
          Aucun concert.{" "}
          <Link href="/admin/concerts/new" className="text-primary hover:underline">
            Ajouter un concert
          </Link>
        </p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Billetterie</TableHead>
                <TableHead className="text-center">À venir</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialConcerts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{formatDate(c.event_date)}</TableCell>
                  <TableCell>{c.city}</TableCell>
                  <TableCell>{c.country}</TableCell>
                  <TableCell>{c.venue}</TableCell>
                  <TableCell>{c.ticket_label ?? "—"}</TableCell>
                  <TableCell className="text-center">
                    {c.is_upcoming ? "Oui" : "Non"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/concerts/${c.id}/edit`}>
                          Modifier
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(c.id)}
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
            <AlertDialogTitle>Supprimer le concert</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce concert ?
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
