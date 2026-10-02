"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { GltfOrFallback } from "@/three/models/model-loader";

interface FlowersProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  modelUrl?: string;
}

const PETAL_COLORS = ["#f4c7d4", "#f7e0e8", "#eab4c4"];

export function Flowers({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, modelUrl }: FlowersProps) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const sway = hovered ? 0.18 : 0.05;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 1.5) * sway;
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <GltfOrFallback
        url={modelUrl}
        fallback={
          <group>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
              <meshStandardMaterial color="#6a8f5c" />
            </mesh>
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(angle) * 0.12, 0.05, Math.sin(angle) * 0.12]}
                  rotation={[Math.PI / 2.4, 0, angle]}
                >
                  <coneGeometry args={[0.1, 0.22, 8]} />
                  <meshStandardMaterial color={PETAL_COLORS[i % PETAL_COLORS.length]} />
                </mesh>
              );
            })}
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#f2c14e" />
            </mesh>
          </group>
        }
      />
    </group>
  );
}