import Link from "next/link";
import { getAlbumById, getAlbumTracksByAlbumId } from "@/lib/albums";
import { EditAlbumForm } from "@/components/admin/edit-album-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditAlbumPage({ params }: Props) {
  const { id } = await params;
  const item = await getAlbumById(id);

  if (!item) {
    return (
      <div className="p-4 lg:p-8 max-w-md mx-auto">
        <p className="text-destructive mb-4">Album introuvable.</p>
        <Link
          href="/admin/albums"
          className="text-sm text-primary hover:underline"
        >
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  const tracks = await getAlbumTracksByAlbumId(id);
  return <EditAlbumForm item={item} tracks={tracks} />;
}
