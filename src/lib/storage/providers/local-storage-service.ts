import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import type { StorageService, UploadOptions, UploadResult } from "@/lib/storage/storage-service";
import { slugify } from "@/lib/utils/slug";

export class LocalStorageService implements StorageService {
  private readonly rootDir: string;
  private readonly publicBaseUrl: string;

  constructor() {
    this.rootDir = path.resolve(process.cwd(), process.env.STORAGE_PATH ?? "./public/uploads");
    this.publicBaseUrl = (process.env.STORAGE_PUBLIC_BASE_URL ?? "/uploads").replace(/\/$/, "");
  }

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    const folder = options?.folder ?? "misc";
    const ext = path.extname(file.name) || "";
    const baseName = slugify(path.basename(file.name, ext)) || "file";
    const filename = `${baseName}-${nanoid(10)}${ext.toLowerCase()}`;

    const targetDir = path.join(this.rootDir, folder);
    await mkdir(targetDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(targetDir, filename), buffer);

    const relativePath = `${folder}/${filename}`;

    return {
      path: relativePath,
      url: this.getUrl(relativePath),
      size: file.size,
      mimeType: file.type || "application/octet-stream",
    };
  }

  async delete(relativePath: string): Promise<void> {
    const safePath = this.resolveSafePath(relativePath);
    await rm(safePath, { force: true });
  }

  getUrl(relativePath: string): string {
    return `${this.publicBaseUrl}/${relativePath.replace(/^\//, "")}`;
  }

  private resolveSafePath(relativePath: string): string {
    const resolved = path.resolve(this.rootDir, relativePath);
    if (!resolved.startsWith(this.rootDir)) {
      throw new Error("Invalid storage path");
    }
    return resolved;
  }
}
