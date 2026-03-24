import { getAllHeroHighlightsForAdmin } from "@/lib/hero-highlights";
import { AdminHeroHighlightsListClient } from "@/components/admin/hero-highlights-list-client";

export const dynamic = "force-dynamic";

export default async function AdminHeroHighlightsPage() {
  const items = await getAllHeroHighlightsForAdmin();
  return <AdminHeroHighlightsListClient initialItems={items} />;
}
