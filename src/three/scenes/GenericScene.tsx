"use client";

import { SceneLighting } from "@/three/lighting/SceneLighting";
import { InvitationCamera } from "@/three/cameras/InvitationCamera";
import { Flowers } from "@/three/models/Flowers";
import { GiftBox } from "@/three/models/GiftBox";
import { Particles } from "@/three/effects/Particles";
import { SparklesEffect } from "@/three/effects/Sparkles";
import type { CameraKeyframe } from "@/three/animations/CameraAnimations";
import type { InvitationSceneConfig } from "@/types/scene-config";

const DEFAULT_KEYFRAMES: CameraKeyframe[] = [
  { at: 0, position: [0, 0.4, 3.8], target: [0, 0.2, 0], fov: 46 },
  { at: 0.5, position: [1.2, 1, 2], target: [0, 0.3, -0.3], fov: 44 },
  { at: 1, position: [0, 2, 1], target: [0, 0.1, -1], fov: 50 },
];

export function GenericScene({ config }: { config: InvitationSceneConfig }) {
  const particlesEnabled = config.effects.find((e) => e.type === "particles" && e.enabled);
  const sparklesEnabled = config.effects.find((e) => e.type === "sparkles" && e.enabled);

  return (
    <group>
      {config.background.type === "color" && (
        <color attach="background" args={[config.background.value]} />
      )}
      <SceneLighting config={config.lighting} />
      <InvitationCamera keyframes={DEFAULT_KEYFRAMES} />

      <GiftBox position={[0, 0, 0]} scale={1.1} />
      <Flowers position={[-1, -0.3, -0.6]} />
      <Flowers position={[1, -0.3, -0.6]} rotation={[0, Math.PI, 0]} />

      {particlesEnabled && <Particles count={particlesEnabled.intensity ?? 120} />}
      {sparklesEnabled && <SparklesEffect />}
    </group>
  );
}
