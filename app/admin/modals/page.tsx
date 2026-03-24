import { getAllSiteModalsForAdmin } from "@/lib/site-modals";
import { AdminSiteModalsListClient } from "@/components/admin/site-modals-list-client";

export const dynamic = "force-dynamic";

export default async function AdminModalsPage() {
  const items = await getAllSiteModalsForAdmin();
  return <AdminSiteModalsListClient initialItems={items} />;
}
