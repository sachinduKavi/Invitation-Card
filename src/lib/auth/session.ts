import { cache } from "react";
import { auth } from "@/lib/auth/auth";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.platformRole !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
