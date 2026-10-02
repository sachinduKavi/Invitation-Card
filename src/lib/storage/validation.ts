export const MAX_UPLOAD_SIZE_BYTES: Record<UploadCategory, number> = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  audio: 20 * 1024 * 1024, // 20MB
  model: 50 * 1024 * 1024, // 50MB
  font: 5 * 1024 * 1024, // 5MB
};

export const ALLOWED_MIME_TYPES: Record<UploadCategory, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"],
  model: ["model/gltf-binary", "model/gltf+json", "application/octet-stream"],
  font: ["font/woff", "font/woff2", "font/ttf", "font/otf"],
};

export type UploadCategory = "image" | "video" | "audio" | "model" | "font";

export interface FileValidationError {
  code: "TOO_LARGE" | "INVALID_TYPE";
  message: string;
}

export function validateFile(
  file: File,
  category: UploadCategory
): FileValidationError | null {
  const maxSize = MAX_UPLOAD_SIZE_BYTES[category];
  if (file.size > maxSize) {
    return {
      code: "TOO_LARGE",
      message: `File exceeds the ${Math.round(maxSize / 1024 / 1024)}MB limit for ${category} uploads.`,
    };
  }

  const allowed = ALLOWED_MIME_TYPES[category];
  const isGlbByExtension =
    category === "model" && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"));

  if (!allowed.includes(file.type) && !isGlbByExtension) {
    return {
      code: "INVALID_TYPE",
      message: `"${file.type || "unknown"}" is not an allowed file type for ${category} uploads.`,
    };
  }

  return null;
}
