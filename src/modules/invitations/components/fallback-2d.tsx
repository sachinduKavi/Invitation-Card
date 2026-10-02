import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/modules/invitations/components/countdown";
import type { InvitationContent } from "@/modules/invitations/components/invitation-content";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function Fallback2D({ content }: { content: InvitationContent }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 px-6 py-16 text-center text-white">
      <p className="text-xs uppercase tracking-[0.3em] text-white/70">{content.eyebrow}</p>
      <h1 className="mt-4 font-serif text-4xl sm:text-6xl">{content.title}</h1>
      <p className="mt-3 text-white/80">{content.subtitle}</p>

      <div className="mx-auto mt-10 max-w-xl rounded-3xl bg-white/5 p-6">
        <h2 className="font-serif text-2xl">Our Story</h2>
        <p className="mt-3 text-white/80">{content.story}</p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm">
          <Calendar className="size-4" />
          {formatDate(content.eventDate)}
        </span>
        <Countdown target={content.eventDate} />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {content.gallery.map((item) => (
          <div
            key={item.label}
            className="flex aspect-square flex-col items-center justify-center rounded-2xl text-xs font-medium text-black/60"
            style={{ backgroundColor: item.color }}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        <MapPin className="size-6" />
        <h2 className="font-serif text-2xl">{content.venue}</h2>
        <p className="text-white/80">{content.address}</p>
        <Button variant="secondary" className="mt-2" render={<a href={content.mapUrl ?? "#"} />}>
          Get Directions
        </Button>
      </div>

      <div className="mx-auto mt-10 max-w-sm rounded-3xl bg-white/5 p-6">
        <h2 className="font-serif text-2xl">RSVP</h2>
        <p className="mt-2 text-sm text-white/70">
          3D view isn&apos;t supported on this device — contact the host directly to RSVP.
        </p>
      </div>
    </div>
  );
}
