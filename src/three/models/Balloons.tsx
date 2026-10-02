"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { GltfOrFallback } from "@/three/models/model-loader";

interface BalloonsProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  modelUrl?: string;
}

const BALLOONS = [
  { offset: [-0.6, 0, 0], color: "#f06a8f" },
  { offset: [-0.2, 0.25, 0.1], color: "#5fb3d9" },
  { offset: [0.2, 0.1, -0.1], color: "#f7c948" },
  { offset: [0.6, 0.3, 0], color: "#8bc98a" },
] as const;

export function Balloons({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, modelUrl }: BalloonsProps) {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.position.y = BALLOONS[i]?.offset[1] + Math.sin(clock.elapsedTime * 1.2 + i) * 0.08;
    });
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <GltfOrFallback
        url={modelUrl}
        fallback={
          <group ref={group}>
            {BALLOONS.map((balloon, i) => (
              <group key={i} position={balloon.offset as unknown as [number, number, number]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.28, 24, 24]} />
                  <meshStandardMaterial color={balloon.color} roughness={0.3} />
                </mesh>
                <mesh position={[0, -0.6, 0]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.8, 4]} />
                  <meshStandardMaterial color="#999999" />
                </mesh>
              </group>
            ))}
          </group>
        }
      />
    </group>
  );
}