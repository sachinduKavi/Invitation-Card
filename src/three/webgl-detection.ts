export type DeviceQuality = "HIGH" | "MEDIUM" | "LOW" | "UNSUPPORTED";

export function detectWebglSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export function detectDeviceQuality(): DeviceQuality {
  if (!detectWebglSupport()) return "UNSUPPORTED";
  if (typeof navigator === "undefined") return "MEDIUM";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile && (cores <= 4 || memory <= 2)) return "LOW";
  if (cores >= 8 && memory >= 8) return "HIGH";
  return "MEDIUM";
}

export const QUALITY_SETTINGS: Record<
  DeviceQuality,
  { dpr: [number, number]; particleCount: number; shadows: boolean }
> = {
  HIGH: { dpr: [1, 2], particleCount: 400, shadows: true },
  MEDIUM: { dpr: [1, 1.5], particleCount: 180, shadows: false },
  LOW: { dpr: [1, 1], particleCount: 60, shadows: false },
  UNSUPPORTED: { dpr: [1, 1], particleCount: 0, shadows: false },
};
