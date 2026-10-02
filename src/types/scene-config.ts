export type SceneType = "wedding" | "birthday" | "custom";

export interface SceneBackground {
  type: "color" | "gradient" | "image";
  value: string;
}

export interface SceneCamera {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export interface SceneLightingConfig {
  ambientIntensity: number;
  directionalIntensity: number;
  color?: string;
}

export type ModelKind =
  | "weddingRings"
  | "weddingCake"
  | "birthdayCake"
  | "balloons"
  | "flowers"
  | "giftBox"
  | "custom";

export interface SceneModel {
  id: string;
  kind: ModelKind;
  modelUrl?: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  interactive?: boolean;
}

export type EffectType = "particles" | "confetti" | "sparkles" | "fireflies";

export interface SceneEffect {
  type: EffectType;
  enabled: boolean;
  intensity?: number;
}

export interface InvitationSceneConfig {
  sceneType: SceneType;
  background: SceneBackground;
  camera: SceneCamera;
  lighting: SceneLightingConfig;
  models: SceneModel[];
  effects: SceneEffect[];
}
