"use client";

import { useState } from "react";
import { SceneLighting } from "@/three/lighting/SceneLighting";
import { InvitationCamera } from "@/three/cameras/InvitationCamera";
import { BirthdayCake } from "@/three/models/BirthdayCake";
import { Balloons } from "@/three/models/Balloons";
import { Particles } from "@/three/effects/Particles";
import { Confetti } from "@/three/effects/Confetti";
import type { CameraKeyframe } from "@/three/animations/CameraAnimations";
import type { InvitationSceneConfig } from "@/types/scene-config";

const DEFAULT_KEYFRAMES: CameraKeyframe[] = [
  { at: 0, position: [0, 0.3, 3.6], target: [0, 0.2, 0], fov: 48 },
  { at: 0.3, position: [1.4, 0.8, 2.2], target: [0, 0.3, 0], fov: 45 },
  { at: 0.6, position: [-1.2, 1.1, 1.6], target: [0, 0.4, -0.4], fov: 46 },
  { at: 1, position: [0, 2, 1], target: [0, 0.2, -1], fov: 52 },
];

export function BirthdayScene({ config }: { config: InvitationSceneConfig }) {
  const [confettiBurst, setConfettiBurst] = useState(0);
  const particlesEnabled = config.effects.find((e) => e.type === "particles" && e.enabled);

  return (
    <group>
      {config.background.type === "color" && (
        <color attach="background" args={[config.background.value]} />
      )}
      <SceneLighting config={config.lighting} />
      <InvitationCamera keyframes={DEFAULT_KEYFRAMES} />

      <BirthdayCake
        position={[0, 0.1, 0]}
        scale={1.1}
        onLightCandles={() => setConfettiBurst((v) => v + 1)}
      />
      <Balloons position={[0, 0.9, -0.8]} scale={0.9} />

      {particlesEnabled && <Particles count={particlesEnabled.intensity ?? 120} color="#ffd9e8" />}
      {confettiBurst > 0 && <Confetti key={confettiBurst} count={160} origin={[0, 1.4, 0]} />}
    </group>
  );
}
