"use client";

import { useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { ThreeInvitationCanvas } from "@/three/ThreeInvitationCanvas";
import { WeddingScene } from "@/three/scenes/WeddingScene";
import { BirthdayScene } from "@/three/scenes/BirthdayScene";
import { GenericScene } from "@/three/scenes/GenericScene";
import { Fallback2D } from "@/modules/invitations/components/fallback-2d";
import {
  HeroSection,
  StorySection,
  EventDetailsSection,
  GallerySection,
  VenueSection,
  RsvpSection,
} from "@/modules/invitations/components/invitation-sections";
import type { InvitationContent } from "@/modules/invitations/components/invitation-content";
import type { InvitationSceneConfig } from "@/types/scene-config";
import { detectDeviceQuality, type DeviceQuality } from "@/three/webgl-detection";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

const PAGES = 6;

interface InvitationExperienceProps {
  content: InvitationContent;
  sceneConfig: InvitationSceneConfig;
}

export function InvitationExperience({ content, sceneConfig }: InvitationExperienceProps) {
  const [quality, setQuality] = useState<DeviceQuality | "DETECTING">("DETECTING");

  // Deliberately deferred past the initial render/hydration pass: WebGL/device
  // capability can only be read on the client, and must not run during SSR or
  // during hydration's first pass, or the Fallback2D/Canvas branches would
  // mismatch between server and client output.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuality(detectDeviceQuality());
  }, []);

  if (quality === "DETECTING") {
    return <div className="h-screen w-screen bg-neutral-900" />;
  }

  if (quality === "UNSUPPORTED") {
    return (
      <div className={playfair.variable}>
        <Fallback2D content={content} />
      </div>
    );
  }

  const Scene =
    sceneConfig.sceneType === "wedding"
      ? WeddingScene
      : sceneConfig.sceneType === "birthday"
        ? BirthdayScene
        : GenericScene;

  return (
    <div className={`${playfair.variable} relative h-screen w-screen overflow-hidden`}>
      <ThreeInvitationCanvas
        quality={quality}
        pages={PAGES}
        scene={<Scene config={sceneConfig} />}
        overlay={
          <div className="w-full">
            <HeroSection content={content} />
            <StorySection content={content} />
            <EventDetailsSection content={content} />
            <GallerySection content={content} />
            <VenueSection content={content} />
            <RsvpSection content={content} />
          </div>
        }
      />
    </div>
  );
}
