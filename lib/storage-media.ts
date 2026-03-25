import { supabase } from "@/lib/supabase";

const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export type MediaFolder = "albums" | "singles" | "hero" | "modals";

export function getMediaBucket(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || "media";
}

export function buildMediaPublicUrlPrefix(): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  return `${base}/storage/v1/object/public/${getMediaBucket()}/`;
}

/** URL publique d’un objet dans le bucket configuré. */
export function isManagedMediaUrl(url: string | null | undefined): boolean {
  if (!url || url.includes("..")) return false;
  const prefix = buildMediaPublicUrlPrefix();
  return prefix ? url.startsWith(prefix) : false;
}

export function parseMediaObjectPath(url: string): string | null {
  const prefix = buildMediaPublicUrlPrefix();
  if (!prefix || !url.startsWith(prefix)) return null;
  const objectPath = url.slice(prefix.length);
  if (!objectPath || objectPath.includes("..")) return null;
  return objectPath;
}

function extensionFromFile(file: File): string {
  const m = file.name.match(/\.([a-z0-9]{2,4})$/i);
  if (m) {
    const e = m[1].toLowerCase();
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(e)) {
      return e === "jpeg" ? ".jpg" : `.${e}`;
    }
  }
  const t = file.type;
  if (t === "image/jpeg") return ".jpg";
  if (t === "image/png") return ".png";
  if (t === "image/webp") return ".webp";
  if (t === "image/gif") return ".gif";
  return ".jpg";
}

function uniqueObjectPath(folder: MediaFolder, file: File): string {
  const ext = extensionFromFile(file);
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  return `${folder}/${id}${ext}`;
}

/**
 * Upload admin (client) vers Supabase Storage — nécessite une session authentifiée
 * et des politiques Storage adaptées sur le bucket (voir supabase-storage-setup.sql).
 */
export async function uploadMediaImage(
  file: File,
  folder: MediaFolder
): Promise<{ publicUrl: string } | { error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      error:
        "Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou GIF.",
    };
  }
  if (file.size > MAX_SIZE) {
    return { error: "Fichier trop volumineux (max 5 Mo)." };
  }

  const bucket = getMediaBucket();
  const path = uniqueObjectPath(folder, file);
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });

  if (error) {
    return { error: error.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { publicUrl: data.publicUrl };
}

/** Supprime une image hébergée sur notre bucket Storage, ou une ancienne locale `/images/…` via l’API. */
export async function removePreviousAdminImage(
  url: string | null | undefined
): Promise<void> {
  if (!url) return;

  const objectPath = parseMediaObjectPath(url);
  if (objectPath) {
    const { error } = await supabase.storage
      .from(getMediaBucket())
      .remove([objectPath]);
    if (error && process.env.NODE_ENV === "development") {
      console.warn("[storage] remove:", error.message);
    }
    return;
  }

  if (url.startsWith("/images/") && !url.includes("..")) {
    await fetch("/api/images/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  }
}
