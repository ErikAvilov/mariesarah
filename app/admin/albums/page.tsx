import { getAllAlbumsForAdmin } from "@/lib/albums";
import { AdminAlbumsListClient } from "@/components/admin/albums-list-client";

export const dynamic = "force-dynamic";

export default async function AdminAlbumsPage() {
  const items = await getAllAlbumsForAdmin();
  return <AdminAlbumsListClient initialItems={items} />;
}
