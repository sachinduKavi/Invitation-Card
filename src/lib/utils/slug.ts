import { nanoid } from "nanoid";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function slugWithSuffix(input: string): string {
  const base = slugify(input) || "untitled";
  return `${base}-${nanoid(6).toLowerCase()}`;
}
