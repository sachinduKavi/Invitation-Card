"use client";

import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

interface GltfModelProps {
  url: string;
  scale?: number;
}

function GltfModel({ url, scale = 1 }: GltfModelProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={scale} />;
}

interface GltfOrFallbackProps {
  url?: string;
  scale?: number;
  fallback: React.ReactNode;
}

/**
 * Renders a lazy-loaded GLB/GLTF when a real asset URL is supplied; otherwise
 * renders the stylized procedural fallback so scenes work with zero uploaded assets.
 */
export function GltfOrFallback({ url, scale, fallback }: GltfOrFallbackProps) {
  if (!url) return <>{fallback}</>;

  return (
    <Suspense fallback={fallback}>
      <GltfModel url={url} scale={scale} />
    </Suspense>
  );
}