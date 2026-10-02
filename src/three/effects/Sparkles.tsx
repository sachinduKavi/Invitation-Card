"use client";

import { Sparkles as DreiSparkles } from "@react-three/drei";

interface SparklesEffectProps {
  count?: number;
  scale?: number;
  size?: number;
  speed?: number;
  color?: string;
}

export function SparklesEffect({
  count = 60,
  scale = 4,
  size = 2.5,
  speed = 0.3,
  color = "#ffe9c7",
}: SparklesEffectProps) {
  return <DreiSparkles count={count} scale={scale} size={size} speed={speed} color={color} />;
}