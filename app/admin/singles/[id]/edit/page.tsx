import Link from "next/link";
import { getSingleById } from "@/lib/singles";
import { EditSingleForm } from "@/components/admin/edit-single-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditSinglePage({ params }: Props) {
  const { id } = await params;
  const item = await getSingleById(id);

  if (!item) {
    return (
      <div className="p-4 lg:p-8 max-w-md mx-auto">
        <p className="text-destructive mb-4">Single introuvable.</p>
        <Link
          href="/admin/singles"
          className="text-sm text-primary hover:underline"
        >
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  return <EditSingleForm item={item} />;
}
