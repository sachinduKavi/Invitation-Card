"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Sparkles } from "@react-three/drei";
import { GltfOrFallback } from "@/three/models/model-loader";

interface WeddingRingsProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  modelUrl?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export function WeddingRings({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  modelUrl,
  interactive = true,
  onClick,
}: WeddingRingsProps) {
  const group = useRef<Group>(null);
  const [burst, setBurst] = useState(false);
  const [spinBoost, setSpinBoost] = useState(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * (0.25 + spinBoost);
    if (spinBoost > 0) {
      setSpinBoost((v) => Math.max(0, v - delta * 1.2));
    }
  });

  function handleClick() {
    if (!interactive) return;
    setSpinBoost(3);
    setBurst(true);
    onClick?.();
    setTimeout(() => setBurst(false), 1200);
  }

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={(e) => {
        if (interactive) e.stopPropagation();
      }}
    >
      <GltfOrFallback
        url={modelUrl}
        fallback={
          <group>
            <mesh position={[-0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.45, 0.07, 32, 64]} />
              <meshStandardMaterial color="#e8c76f" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.45, 0.07, 32, 64]} />
              <meshStandardMaterial color="#f4e2a1" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        }
      />
      {burst && <Sparkles count={40} scale={2} size={4} speed={1.2} color="#ffe9b0" />}
    </group>
  );
}