import { NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
import path from "path";
import {
  createServiceSupabase,
  getStorageBucket,
} from "@/lib/supabase-service";

const PUBLIC_IMAGES = "public/images";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type UploadLike = {
  name?: string;
  type?: string;
  size?: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

function isUploadLike(value: unknown): value is UploadLike {
  if (!value || typeof value !== "object") return false;
  const maybe = value as UploadLike;
  return typeof maybe.arrayBuffer === "function";
}

function sanitizeBaseName(filename: string): string {
  const base = filename
    .replace(/\.[^/.]+$/, "")
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "image";
}

async function buildAvailableFilename(dir: string, preferredName: string): Promise<string> {
  const parsed = path.parse(preferredName);
  const safeBase = sanitizeBaseName(parsed.name || "image");
  const safeExt = parsed.ext || ".jpg";
  let candidate = `${safeBase}${safeExt}`;
  let i = 2;

  while (true) {
    try {
      await access(path.join(dir, candidate));
      candidate = `${safeBase}-${i}${safeExt}`;
      i += 1;
    } catch {
      return candidate;
    }
  }
}

async function buildAvailableStorageObjectName(
  preferredName: string,
  bucket: string
): Promise<string> {
  const supabase = createServiceSupabase();
  if (!supabase) return preferredName;

  const parsed = path.parse(preferredName);
  const safeBase = sanitizeBaseName(parsed.name || "image");
  const safeExt = parsed.ext || ".jpg";
  let candidate = `${safeBase}${safeExt}`;
  let i = 2;

  const { data: files, error } = await supabase.storage
    .from(bucket)
    .list("images", { limit: 1000 });

  if (error) return candidate;

  const existing = new Set((files ?? []).map((f) => f.name));
  while (existing.has(candidate)) {
    candidate = `${safeBase}-${i}${safeExt}`;
    i += 1;
  }
  return candidate;
}

async function uploadToSupabaseStorage(
  buffer: Buffer,
  mimeType: string,
  objectName: string
): Promise<string> {
  const supabase = createServiceSupabase();
  const bucket = getStorageBucket();
  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manquant pour l’upload distant.");
  }

  const objectPath = `images/${objectName}`;
  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType: mimeType,
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

async function uploadToLocalPublicImages(
  buffer: Buffer,
  preferredName: string
): Promise<string> {
  const dir = path.join(process.cwd(), PUBLIC_IMAGES);
  await mkdir(dir, { recursive: true });
  const name = await buildAvailableFilename(dir, preferredName);
  const filepath = path.join(dir, name);
  await writeFile(filepath, buffer);
  return `/images/${name}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as unknown;

    if (!isUploadLike(file)) {
      return NextResponse.json(
        { error: "Aucun fichier fourni." },
        { status: 400 }
      );
    }

    const mimeType = String(file.type ?? "");
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou GIF." },
        { status: 400 }
      );
    }

    const fileSize = Number(file.size ?? 0);
    if (!Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json(
        { error: "Fichier invalide." },
        { status: 400 }
      );
    }

    if (fileSize > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 5 Mo)." },
        { status: 400 }
      );
    }

    const originalName = String(file.name ?? "");
    const ext = path.extname(originalName).toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)
      ? ext
      : ".jpg";
    const preferredName = `${sanitizeBaseName(originalName || "image")}${safeExt}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const useStorage = Boolean(createServiceSupabase());

    let url: string;
    if (useStorage) {
      const bucket = getStorageBucket();
      const objectName = await buildAvailableStorageObjectName(preferredName, bucket);
      url = await uploadToSupabaseStorage(buffer, mimeType, objectName);
    } else {
      url = await uploadToLocalPublicImages(buffer, preferredName);
    }

    return NextResponse.json({ url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de l’enregistrement du fichier.";
    const isReadonlyFs = /EROFS|EPERM|EACCES/i.test(message);

    let userMessage = "Erreur lors de l’enregistrement du fichier.";
    if (isReadonlyFs) {
      userMessage =
        "Écriture impossible sur le serveur (hébergement sans disque inscriptible). Ajoutez SUPABASE_SERVICE_ROLE_KEY et un bucket Storage public — voir supabase-storage-setup.sql.";
    } else if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      userMessage = message;
    }

    return NextResponse.json(
      {
        error: userMessage,
        details: process.env.NODE_ENV !== "production" ? message : undefined,
      },
      { status: 500 }
    );
  }
}
