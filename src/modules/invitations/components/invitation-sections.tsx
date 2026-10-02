"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Countdown } from "@/modules/invitations/components/countdown";
import { OpenInvitationButton } from "@/modules/invitations/components/open-invitation-button";
import type { InvitationContent } from "@/modules/invitations/components/invitation-content";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function HeroSection({ content }: { content: InvitationContent }) {
  return (
    <section className="flex h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-xs uppercase tracking-[0.3em] text-white/80"
      >
        {content.eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="font-serif text-5xl text-white drop-shadow-lg sm:text-7xl"
      >
        {content.title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="max-w-md text-balance text-white/90"
      >
        {content.subtitle}
      </motion.p>
      <OpenInvitationButton />
    </section>
  );
}

export function StorySection({ content }: { content: InvitationContent }) {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
      <motion.div {...fadeUp} className="max-w-xl rounded-3xl bg-black/30 p-8 backdrop-blur-md">
        <h2 className="mb-4 font-serif text-3xl text-white">Our Story</h2>
        <p className="text-white/85">{content.story}</p>
      </motion.div>
    </section>
  );
}

export function EventDetailsSection({ content }: { content: InvitationContent }) {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.div {...fadeUp} className="flex flex-col items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
          <Calendar className="size-4" />
          {formatDate(content.eventDate)}
        </span>
        <h2 className="font-serif text-3xl text-white">Save the Date</h2>
        <Countdown target={content.eventDate} />
      </motion.div>
    </section>
  );
}

export function GallerySection({ content }: { content: InvitationContent }) {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 text-center">
      <motion.h2 {...fadeUp} className="font-serif text-3xl text-white">
        Gallery
      </motion.h2>
      <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
        {content.gallery.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex aspect-square flex-col items-center justify-center rounded-2xl text-xs font-medium text-black/60 shadow-lg"
            style={{ backgroundColor: item.color }}
          >
            {item.label}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function VenueSection({ content }: { content: InvitationContent }) {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <motion.div {...fadeUp} className="flex flex-col items-center gap-3">
        <MapPin className="size-8 text-white" />
        <h2 className="font-serif text-3xl text-white">{content.venue}</h2>
        <p className="text-white/80">{content.address}</p>
        <Button variant="secondary" render={<a href={content.mapUrl ?? "#"} />}>
          Get Directions
        </Button>
      </motion.div>
    </section>
  );
}

export function RsvpSection({ content }: { content: InvitationContent }) {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
      <motion.div
        {...fadeUp}
        className="w-full max-w-md rounded-3xl bg-black/40 p-8 text-left backdrop-blur-md"
      >
        <h2 className="mb-1 text-center font-serif text-3xl text-white">RSVP</h2>
        <p className="mb-6 text-center text-sm text-white/70">
          Kindly respond by {formatDate(content.eventDate)}.
        </p>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("This is a preview — RSVPs aren't saved yet.");
          }}
        >
          <Input placeholder="Full name" required className="bg-white/90" />
          <Input type="email" placeholder="Email" required className="bg-white/90" />
          <Textarea placeholder="Message (optional)" className="bg-white/90" />
          <Button type="submit" className="mt-2">
            Send RSVP
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
