"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import type { DeviceQuality } from "@/three/webgl-detection";
import { QUALITY_SETTINGS } from "@/three/webgl-detection";

interface ThreeInvitationCanvasProps {
  quality: DeviceQuality;
  pages: number;
  scene: React.ReactNode;
  overlay: React.ReactNode;
}

export function ThreeInvitationCanvas({ quality, pages, scene, overlay }: ThreeInvitationCanvasProps) {
  const settings = QUALITY_SETTINGS[quality];

  return (
    <Canvas
      dpr={settings.dpr}
      shadows={settings.shadows}
      gl={{ antialias: true, alpha: false }}
      className="!fixed inset-0"
    >
      <Suspense fallback={null}>
        <ScrollControls pages={pages} damping={0.25}>
          {scene}
          <Scroll html style={{ width: "100%" }}>
            {overlay}
          </Scroll>
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}
