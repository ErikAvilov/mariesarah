import { getAllConcertsForAdmin } from "@/lib/concerts";
import { AdminConcertsListClient } from "@/components/admin/concerts-list-client";

export default async function AdminConcertsPage() {
  const concerts = await getAllConcertsForAdmin();
  return <AdminConcertsListClient initialConcerts={concerts} />;
}
