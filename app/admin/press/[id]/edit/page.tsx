import Link from "next/link";
import { getPressById } from "@/lib/press";
import { EditPressForm } from "@/components/admin/edit-press-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditPressPage({ params }: Props) {
  const { id } = await params;
  const item = await getPressById(id);

  if (!item) {
    return (
      <div className="p-4 lg:p-8 max-w-md mx-auto">
        <p className="text-destructive mb-4">Lien introuvable.</p>
        <Link
          href="/admin/press"
          className="text-sm text-primary hover:underline"
        >
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  return <EditPressForm item={item} />;
}
