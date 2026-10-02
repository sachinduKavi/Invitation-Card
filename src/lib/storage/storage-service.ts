import { LocalStorageService } from "@/lib/storage/providers/local-storage-service";

export interface UploadResult {
  /** Storage-relative key. Persist this, not the URL — URLs can change providers. */
  path: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface UploadOptions {
  /** Logical sub-folder, e.g. a workspace id. Keeps tenants' files separated on disk/bucket. */
  folder?: string;
}

export interface StorageService {
  upload(file: File, options?: UploadOptions): Promise<UploadResult>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}

let cachedService: StorageService | undefined;

export function getStorageService(): StorageService {
  if (cachedService) return cachedService;

  const provider = process.env.STORAGE_PROVIDER ?? "local";

  switch (provider) {
    case "local": {
      cachedService = new LocalStorageService();
      break;
    }
    default:
      throw new Error(
        `Unknown STORAGE_PROVIDER "${provider}". Supported: local. ` +
          `Add a new provider under src/lib/storage/providers and register it here.`
      );
  }

  return cachedService;
}
