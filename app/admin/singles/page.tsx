import { getAllSinglesForAdmin } from "@/lib/singles";
import { AdminSinglesListClient } from "@/components/admin/singles-list-client";

export const dynamic = "force-dynamic";

export default async function AdminSinglesPage() {
  const items = await getAllSinglesForAdmin();
  return <AdminSinglesListClient initialItems={items} />;
}
