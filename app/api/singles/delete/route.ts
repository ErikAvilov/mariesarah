import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { getSingleById } from "@/lib/singles";
import { supabase } from "@/lib/supabase";

/** Supprime un single en base et le fichier image dans public/images si l'URL est locale */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body?.id;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "id manquant ou invalide." },
        { status: 400 }
      );
    }

    const single = await getSingleById(id);
    if (!single) {
      return NextResponse.json(
        { error: "Single introuvable." },
        { status: 404 }
      );
    }

    // Supprimer le fichier image si c'est un chemin local /images/...
    const imageUrl = single.image_url ?? "";
    if (imageUrl.startsWith("/images/") && !imageUrl.includes("..")) {
      const filename = imageUrl.slice("/images/".length);
      const filepath = path.join(process.cwd(), "public", "images", filename);
      try {
        await unlink(filepath);
      } catch {
        // Fichier déjà absent ou autre erreur : on continue quand même
      }
    }

    const { error } = await supabase.from("singles").delete().eq("id", id);
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 }
    );
  }
}
