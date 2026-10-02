"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { GltfOrFallback } from "@/three/models/model-loader";

interface BirthdayCakeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  modelUrl?: string;
  interactive?: boolean;
  onLightCandles?: () => void;
}

const CANDLE_POSITIONS: [number, number, number][] = [
  [-0.3, 0.62, 0],
  [0, 0.68, 0.15],
  [0.3, 0.62, 0],
];

export function BirthdayCake({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  modelUrl,
  interactive = true,
  onLightCandles,
}: BirthdayCakeProps) {
  const group = useRef<Group>(null);
  const [lit, setLit] = useState(false);
  const flameRefs = useRef<Mesh[]>([]);

  useFrame(({ clock }) => {
    if (!lit) return;
    flameRefs.current.forEach((flame, i) => {
      if (!flame) return;
      const flicker = 1 + Math.sin(clock.elapsedTime * 10 + i) * 0.15;
      flame.scale.setScalar(flicker);
    });
  });

  function handleClick() {
    if (!interactive || lit) return;
    setLit(true);
    onLightCandles?.();
  }

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} onClick={handleClick}>
      <GltfOrFallback
        url={modelUrl}
        fallback={
          <group>
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.55, 0.6, 0.3, 32]} />
              <meshStandardMaterial color="#f6d9e5" />
            </mesh>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.4, 0.45, 0.3, 32]} />
              <meshStandardMaterial color="#fcebf2" />
            </mesh>
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.32, 0.22, 32]} />
              <meshStandardMaterial color="#f8c9db" />
            </mesh>
            {CANDLE_POSITIONS.map((candlePos, i) => (
              <group key={i} position={candlePos}>
                <mesh>
                  <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
                  <meshStandardMaterial color="#fff4de" />
                </mesh>
                {lit && (
                  <mesh
                    position={[0, 0.14, 0]}
                    ref={(el) => {
                      if (el) flameRefs.current[i] = el;
                    }}
                  >
                    <coneGeometry args={[0.03, 0.08, 8]} />
                    <meshStandardMaterial
                      color="#ffb347"
                      emissive="#ff8a00"
                      emissiveIntensity={2}
                    />
                  </mesh>
                )}
                {lit && (
                  <pointLight position={[0, 0.16, 0]} intensity={0.6} color="#ffb347" distance={1.5} />
                )}
              </group>
            ))}
          </group>
        }
      />
    </group>
  );
}