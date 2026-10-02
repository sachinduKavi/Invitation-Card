import type { SceneLightingConfig } from "@/types/scene-config";

export function SceneLighting({ config }: { config: SceneLightingConfig }) {
  return (
    <>
      <ambientLight intensity={config.ambientIntensity} color={config.color ?? "#fff7ec"} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={config.directionalIntensity}
        color={config.color ?? "#ffffff"}
      />
      <pointLight position={[-4, 2, -3]} intensity={config.directionalIntensity * 0.4} color="#ffd9a0" />
    </>
  );
}
