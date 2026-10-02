"use client";

// Math.random() here seeds one-time confetti velocities inside useMemo; the
// react-hooks/purity rule can't see that it only runs once per mount.
/* eslint-disable react-hooks/purity */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Object3D, Color, DoubleSide } from "three";

interface ConfettiProps {
  count?: number;
  colors?: string[];
  origin?: [number, number, number];
  spread?: number;
}

interface Piece {
  velocity: [number, number, number];
  spin: [number, number, number];
  life: number;
  color: string;
}

const DEFAULT_COLORS = ["#f06a8f", "#5fb3d9", "#f7c948", "#8bc98a", "#c58af2"];

export function Confetti({
  count = 120,
  colors = DEFAULT_COLORS,
  origin = [0, 1, 0],
  spread = 1.4,
}: ConfettiProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const elapsed = useRef(0);
  const colorsInitialized = useRef(false);

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        velocity: [(Math.random() - 0.5) * spread, Math.random() * 2 + 1.5, (Math.random() - 0.5) * spread],
        spin: [Math.random() * 6, Math.random() * 6, Math.random() * 6],
        life: Math.random() * 0.4,
        color: colors[i % colors.length],
      })),
    [count, spread, colors]
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!colorsInitialized.current) {
      pieces.forEach((piece, i) => mesh.setColorAt(i, new Color(piece.color)));
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      colorsInitialized.current = true;
    }

    elapsed.current += delta;

    pieces.forEach((piece, i) => {
      const t = elapsed.current - piece.life;
      if (t < 0) {
        dummy.position.set(origin[0], origin[1] - 10, origin[2]);
      } else {
        const gravity = 2.2;
        dummy.position.set(
          origin[0] + piece.velocity[0] * t,
          origin[1] + piece.velocity[1] * t - 0.5 * gravity * t * t,
          origin[2] + piece.velocity[2] * t
        );
        dummy.rotation.set(piece.spin[0] * t, piece.spin[1] * t, piece.spin[2] * t);
      }
      dummy.scale.setScalar(0.06);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial side={DoubleSide} />
    </instancedMesh>
  );
}