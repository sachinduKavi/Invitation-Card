export interface InvitationContent {
  eventType: "wedding" | "birthday" | "custom";
  eyebrow: string;
  title: string;
  subtitle: string;
  hostLine?: string;
  story: string;
  eventDate: Date;
  venue: string;
  address: string;
  mapUrl?: string;
  gallery: { color: string; label: string }[];
}

export const WEDDING_DEMO_CONTENT: InvitationContent = {
  eventType: "wedding",
  eyebrow: "Together With Their Families",
  title: "John & Jane",
  subtitle: "Invite you to celebrate their wedding",
  story:
    "What started as a chance meeting at a coffee shop grew into a lifetime of adventures. After years of laughter, travel, and unwavering support for one another, John and Jane are ready to say \"I do\" surrounded by the people they love most.",
  eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 62),
  venue: "The Rosewood Garden Estate",
  address: "482 Vineyard Lane, Napa Valley, CA",
  mapUrl: "#",
  gallery: [
    { color: "#f4e2c8", label: "Engagement" },
    { color: "#e9c6cf", label: "First trip" },
    { color: "#d9c7e8", label: "Proposal" },
    { color: "#f0d9b5", label: "Family" },
  ],
};

export const BIRTHDAY_DEMO_CONTENT: InvitationContent = {
  eventType: "birthday",
  eyebrow: "Let's Celebrate!",
  title: "Happy Birthday, Alex!",
  subtitle: "You're invited",
  story:
    "Alex is turning 30! Join us for an evening of cake, music, and celebration as we toast to another year of adventures. Come ready to dance — there might even be a surprise or two.",
  eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18),
  venue: "Skyline Rooftop Lounge",
  address: "1200 Sunset Blvd, Los Angeles, CA",
  mapUrl: "#",
  gallery: [
    { color: "#ffd9e8", label: "Last year" },
    { color: "#bfe8ff", label: "Friends" },
    { color: "#fff0b8", label: "Cake time" },
    { color: "#d2f5d2", label: "Squad" },
  ],
};
