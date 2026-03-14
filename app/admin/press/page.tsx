import { getAllPressForAdmin } from "@/lib/press";
import { AdminPressListClient } from "@/components/admin/press-list-client";

export const dynamic = "force-dynamic";

export default async function AdminPressPage() {
  const items = await getAllPressForAdmin();
  return <AdminPressListClient initialItems={items} />;
}
