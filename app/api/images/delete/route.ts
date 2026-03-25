import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import {
  createServiceSupabase,
  getStorageBucket,
} from "@/lib/supabase-service";

function parseStorageObjectPath(imageUrl: string): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const bucket = getStorageBucket();
  if (!base) return null;
  const prefix = `${base}/storage/v1/object/public/${bucket}/`;
  if (!imageUrl.startsWith(prefix)) return null;
  const objectPath = imageUrl.slice(prefix.length);
  if (!objectPath || objectPath.includes("..")) return null;
  return objectPath;
}

/** Supprime une image locale (/images/…) ou un objet du bucket Supabase configuré. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body?.url;
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "url manquant ou invalide." },
        { status: 400 }
      );
    }

    const storagePath = parseStorageObjectPath(url);
    if (storagePath) {
      const supabase = createServiceSupabase();
      if (!supabase) {
        return NextResponse.json(
          { error: "SUPABASE_SERVICE_ROLE_KEY requis pour supprimer un fichier Storage." },
          { status: 503 }
        );
      }
      const { error } = await supabase.storage
        .from(getStorageBucket())
        .remove([storagePath]);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    if (!url.startsWith("/images/") || url.includes("..")) {
      return NextResponse.json(
        { error: "URL non autorisée." },
        { status: 400 }
      );
    }
    const filename = url.slice("/images/".length);
    const filepath = path.join(process.cwd(), "public", "images", filename);
    await unlink(filepath);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
