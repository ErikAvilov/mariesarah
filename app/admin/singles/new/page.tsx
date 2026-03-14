import { getAllSinglesForAdmin } from "@/lib/singles";
import { NewSingleForm } from "@/components/admin/new-single-form";

export const dynamic = "force-dynamic";

export default async function AdminNewSinglePage() {
  const existingSingles = await getAllSinglesForAdmin();
  return <NewSingleForm existingSingles={existingSingles} />;
}
