"use client";

import { useState } from "react";
import { SceneLighting } from "@/three/lighting/SceneLighting";
import { InvitationCamera } from "@/three/cameras/InvitationCamera";
import { WeddingRings } from "@/three/models/WeddingRings";
import { Flowers } from "@/three/models/Flowers";
import { Particles } from "@/three/effects/Particles";
import { SparklesEffect } from "@/three/effects/Sparkles";
import type { CameraKeyframe } from "@/three/animations/CameraAnimations";
import type { InvitationSceneConfig } from "@/types/scene-config";

const DEFAULT_KEYFRAMES: CameraKeyframe[] = [
  { at: 0, position: [0, 0.4, 4.2], target: [0, 0.2, 0], fov: 45 },
  { at: 0.25, position: [1.6, 0.9, 2.4], target: [0, 0.3, 0], fov: 42 },
  { at: 0.55, position: [-1.4, 1.2, 1.8], target: [0, 0.4, -0.5], fov: 44 },
  { at: 1, position: [0, 2.2, 0.8], target: [0, 0, -1], fov: 50 },
];

export function WeddingScene({ config }: { config: InvitationSceneConfig }) {
  const [particleBoost, setParticleBoost] = useState(0);
  const particlesEnabled = config.effects.find((e) => e.type === "particles" && e.enabled);
  const sparklesEnabled = config.effects.find((e) => e.type === "sparkles" && e.enabled);

  return (
    <group>
      {config.background.type === "color" && (
        <color attach="background" args={[config.background.value]} />
      )}
      <SceneLighting config={config.lighting} />
      <InvitationCamera keyframes={DEFAULT_KEYFRAMES} />

      <WeddingRings
        position={[0, 0.3, 0]}
        scale={1.1}
        onClick={() => setParticleBoost((v) => v + 1)}
      />
      <Flowers position={[-1.1, -0.3, -0.4]} scale={1.3} />
      <Flowers position={[1.1, -0.35, -0.6]} scale={1.1} rotation={[0, Math.PI / 3, 0]} />
      <Flowers position={[0, -0.4, -1.4]} scale={0.9} rotation={[0, Math.PI, 0]} />

      {particlesEnabled && (
        <Particles
          count={particlesEnabled.intensity ?? 150}
          spread={6}
          color="#ffe9c7"
          key={particleBoost}
        />
      )}
      {sparklesEnabled && <SparklesEffect count={70} scale={5} color="#f4e2a1" />}
    </group>
  );
}
