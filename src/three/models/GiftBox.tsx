"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Sparkles } from "@react-three/drei";
import { GltfOrFallback } from "@/three/models/model-loader";

interface GiftBoxProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  modelUrl?: string;
  interactive?: boolean;
  onOpen?: () => void;
}

export function GiftBox({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  modelUrl,
  interactive = true,
  onOpen,
}: GiftBoxProps) {
  const lid = useRef<Group>(null);
  const [open, setOpen] = useState(false);

  useFrame((_, delta) => {
    if (!lid.current) return;
    const targetY = open ? 0.55 : 0.3;
    const targetRotZ = open ? 0.6 : 0;
    lid.current.position.y += (targetY - lid.current.position.y) * Math.min(1, delta * 4);
    lid.current.rotation.z += (targetRotZ - lid.current.rotation.z) * Math.min(1, delta * 4);
  });

  function handleClick() {
    if (!interactive || open) return;
    setOpen(true);
    onOpen?.();
  }

  return (
    <group position={position} rotation={rotation} scale={scale} onClick={handleClick}>
      <GltfOrFallback
        url={modelUrl}
        fallback={
          <group>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.6, 0.4, 0.6]} />
              <meshStandardMaterial color="#c4455a" />
            </mesh>
            <group ref={lid} position={[0, 0.3, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.64, 0.12, 0.64]} />
                <meshStandardMaterial color="#9e2f42" />
              </mesh>
            </group>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.08, 0.5, 0.62]} />
              <meshStandardMaterial color="#f2d16b" />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.62, 0.5, 0.08]} />
              <meshStandardMaterial color="#f2d16b" />
            </mesh>
          </group>
        }
      />
      {open && <Sparkles count={30} scale={1.5} size={3} speed={0.8} color="#ffe9b0" />}
    </group>
  );
}