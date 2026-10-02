import { InvitationExperience } from "@/modules/invitations/components/invitation-experience";
import { BIRTHDAY_DEMO_CONTENT } from "@/modules/invitations/components/invitation-content";
import type { InvitationSceneConfig } from "@/types/scene-config";

const sceneConfig: InvitationSceneConfig = {
  sceneType: "birthday",
  background: { type: "color", value: "#241a2e" },
  camera: { position: [0, 0.3, 3.6], target: [0, 0.2, 0] },
  lighting: { ambientIntensity: 0.7, directionalIntensity: 1.1, color: "#ffe8f3" },
  models: [],
  effects: [{ type: "particles", enabled: true, intensity: 120 }],
};

export default function BirthdayDemoPage() {
  return <InvitationExperience content={BIRTHDAY_DEMO_CONTENT} sceneConfig={sceneConfig} />;
}
