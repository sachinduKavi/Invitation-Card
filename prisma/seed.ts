import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

const PLANS = [
  {
    tier: "FREE" as const,
    name: "Free",
    priceMonthlyCents: 0,
    priceYearlyCents: 0,
    maxInvitations: 1,
    maxWorkspaceMembers: 1,
    features: {
      premiumTemplates: false,
      advancedScenes: false,
      customThemes: false,
      removeBranding: false,
      analytics: "basic",
      customDomains: false,
    },
  },
  {
    tier: "PRO" as const,
    name: "Pro",
    priceMonthlyCents: 1900,
    priceYearlyCents: 19000,
    maxInvitations: 10,
    maxWorkspaceMembers: 3,
    features: {
      premiumTemplates: true,
      advancedScenes: true,
      customThemes: true,
      removeBranding: true,
      analytics: "advanced",
      customDomains: false,
    },
  },
  {
    tier: "BUSINESS" as const,
    name: "Business",
    priceMonthlyCents: 4900,
    priceYearlyCents: 49000,
    maxInvitations: -1,
    maxWorkspaceMembers: 25,
    features: {
      premiumTemplates: true,
      advancedScenes: true,
      customThemes: true,
      removeBranding: true,
      analytics: "advanced",
      customDomains: true,
      premium3dAssets: true,
    },
  },
];

async function main() {
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { tier: plan.tier },
      create: plan,
      update: plan,
    });
  }
  console.log(`Seeded ${PLANS.length} plans.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
