"use client";

// Math.random() here seeds a one-time firefly layout inside useMemo; the
// react-hooks/purity rule can't see that it only runs once per mount.
/* eslint-disable react-hooks/purity */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points as ThreePoints } from "three";
import { BufferAttribute } from "three";

interface FirefliesProps {
  count?: number;
  spread?: number;
  color?: string;
}

export function Fireflies({ count = 40, spread = 5, color = "#bdf29a" }: FirefliesProps) {
  const pointsRef = useRef<ThreePoints>(null);

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = Math.random() * spread * 0.6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [pos, ph];
  }, [count, spread]);

  useFrame(({ clock }) => {
    const attr = pointsRef.current?.geometry.getAttribute("position") as
      | BufferAttribute
      | undefined;
    if (!attr) return;
    for (let i = 0; i < count; i++) {
      const t = clock.elapsedTime + phases[i];
      attr.setX(i, positions[i * 3] + Math.sin(t * 0.6) * 0.3);
      attr.setY(i, positions[i * 3 + 1] + Math.sin(t) * 0.15);
      attr.setZ(i, positions[i * 3 + 2] + Math.cos(t * 0.6) * 0.3);
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
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}