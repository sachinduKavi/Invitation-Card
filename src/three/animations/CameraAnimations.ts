"use client";

import { Vector3 } from "three";

export interface CameraKeyframe {
  at: number; // 0..1 progress along the scroll timeline
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export interface CameraState {
  position: Vector3;
  target: Vector3;
  fov: number;
}

const tmpA = new Vector3();
const tmpB = new Vector3();

export function getCameraStateAtProgress(
  keyframes: CameraKeyframe[],
  progress: number,
  defaultFov = 50
): CameraState {
  const clamped = Math.min(1, Math.max(0, progress));
  const sorted = keyframes;

  let start = sorted[0];
  let end = sorted[sorted.length - 1];

  for (let i = 0; i < sorted.length - 1; i++) {
    if (clamped >= sorted[i].at && clamped <= sorted[i + 1].at) {
      start = sorted[i];
      end = sorted[i + 1];
      break;
    }
  }

  const span = end.at - start.at || 1;
  const t = Math.min(1, Math.max(0, (clamped - start.at) / span));

  tmpA.set(...start.position);
  tmpB.set(...end.position);
  const position = tmpA.clone().lerp(tmpB, t);

  tmpA.set(...start.target);
  tmpB.set(...end.target);
  const target = tmpA.clone().lerp(tmpB, t);

  const fov = (start.fov ?? defaultFov) + ((end.fov ?? defaultFov) - (start.fov ?? defaultFov)) * t;

  return { position, target, fov };
}