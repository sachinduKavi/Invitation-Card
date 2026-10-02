"use client";

// Math.random() here seeds a one-time particle layout inside useMemo; the
// react-hooks/purity rule can't see that it only runs once per mount.
/* eslint-disable react-hooks/purity */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points as ThreePoints } from "three";
import { BufferAttribute } from "three";

interface ParticlesProps {
  count?: number;
  spread?: number;
  color?: string;
  size?: number;
  speed?: number;
}

export function Particles({
  count = 150,
  spread = 6,
  color = "#ffe9c7",
  size = 0.035,
  speed = 0.15,
}: ParticlesProps) {
  const pointsRef = useRef<ThreePoints>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = Math.random() * spread - spread / 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      spd[i] = 0.3 + Math.random() * 0.7;
    }
    return [pos, spd];
  }, [count, spread]);

  useFrame((_, delta) => {
    const geometry = pointsRef.current?.geometry;
    const attr = geometry?.getAttribute("position") as BufferAttribute | undefined;
    if (!attr) return;

    for (let i = 0; i < count; i++) {
      const y = attr.getY(i) + delta * speed * speeds[i];
      attr.setY(i, y > spread / 2 ? -spread / 2 : y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}