import Link from "next/link";
import { getSiteModalById } from "@/lib/site-modals";
import { EditSiteModalForm } from "@/components/admin/edit-site-modal-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditModalPage({ params }: Props) {
  const { id } = await params;
  const item = await getSiteModalById(id);

  if (!item) {
    return (
      <div className="p-4 lg:p-8 max-w-md mx-auto">
        <p className="text-destructive mb-4">Modal introuvable.</p>
        <Link
          href="/admin/modals"
          className="text-sm text-primary hover:underline"
        >
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  return <EditSiteModalForm item={item} />;
}
