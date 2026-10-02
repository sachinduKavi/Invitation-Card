import { InvitationExperience } from "@/modules/invitations/components/invitation-experience";
import { WEDDING_DEMO_CONTENT } from "@/modules/invitations/components/invitation-content";
import type { InvitationSceneConfig } from "@/types/scene-config";

const sceneConfig: InvitationSceneConfig = {
  sceneType: "wedding",
  background: { type: "color", value: "#1c1712" },
  camera: { position: [0, 0.4, 4.2], target: [0, 0.2, 0] },
  lighting: { ambientIntensity: 0.6, directionalIntensity: 1.2, color: "#fff3e0" },
  models: [],
  effects: [
    { type: "particles", enabled: true, intensity: 150 },
    { type: "sparkles", enabled: true, intensity: 70 },
  ],
};

export default function WeddingDemoPage() {
  return <InvitationExperience content={WEDDING_DEMO_CONTENT} sceneConfig={sceneConfig} />;
}
