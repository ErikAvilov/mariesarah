import { getAllPressForAdmin } from "@/lib/press";
import { AdminPressListClient } from "@/components/admin/press-list-client";

export default async function AdminPressPage() {
  const items = await getAllPressForAdmin();
  return <AdminPressListClient initialItems={items} />;
}
