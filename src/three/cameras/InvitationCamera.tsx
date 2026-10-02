"use client";

// react-three-fiber's useFrame mutates the camera returned by useThree() imperatively
// every frame by design, bypassing React's render cycle for 60fps performance. The
// react-hooks immutability rule doesn't model this and misflags it.
/* eslint-disable react-hooks/immutability */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, PerspectiveCamera } from "@react-three/drei";
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from "three";
import { getCameraStateAtProgress, type CameraKeyframe } from "@/three/animations/CameraAnimations";

interface InvitationCameraProps {
  keyframes: CameraKeyframe[];
  /** Falls back to scroll-driven progress when not provided. */
  progressOverride?: number;
}

export function InvitationCamera({ keyframes, progressOverride }: InvitationCameraProps) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const { camera } = useThree();
  const scroll = useScroll();
  const currentTarget = useRef(new Vector3(...keyframes[0].target));

  useFrame((_, delta) => {
    const progress = progressOverride ?? scroll.offset;
    const { position, target, fov } = getCameraStateAtProgress(keyframes, progress);

    const dampFactor = 1 - Math.pow(0.001, delta);
    camera.position.lerp(position, dampFactor);
    currentTarget.current.lerp(target, dampFactor);
    camera.lookAt(currentTarget.current);

    if (camera instanceof ThreePerspectiveCamera && Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={keyframes[0].position}
      fov={keyframes[0].fov ?? 50}
      near={0.1}
      far={100}
    />
  );
}