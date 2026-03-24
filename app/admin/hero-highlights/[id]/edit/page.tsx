import Link from "next/link";
import { getHeroHighlightById } from "@/lib/hero-highlights";
import { EditHeroHighlightForm } from "@/components/admin/edit-hero-highlight-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditHeroHighlightPage({ params }: Props) {
  const { id } = await params;
  const item = await getHeroHighlightById(id);

  if (!item) {
    return (
      <div className="p-4 lg:p-8 max-w-md mx-auto">
        <p className="text-destructive mb-4">Hero introuvable.</p>
        <Link
          href="/admin/hero-highlights"
          className="text-sm text-primary hover:underline"
        >
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  return <EditHeroHighlightForm item={item} />;
}
