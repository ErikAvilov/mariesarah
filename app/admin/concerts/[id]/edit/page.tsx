import Link from "next/link";
import { getConcertById } from "@/lib/concerts";
import { EditConcertForm } from "@/components/admin/edit-concert-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditConcertPage({ params }: Props) {
  const { id } = await params;
  const concert = await getConcertById(id);

  if (!concert) {
    return (
      <div className="p-4 lg:p-8 max-w-md mx-auto">
        <p className="text-destructive mb-4">Concert introuvable.</p>
        <Link
          href="/admin/concerts"
          className="text-sm text-primary hover:underline"
        >
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  return <EditConcertForm concert={concert} />;
}
