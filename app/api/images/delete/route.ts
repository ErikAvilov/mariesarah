import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

/** Supprime un fichier image dans public/images si l'URL est locale (/images/...) */
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
