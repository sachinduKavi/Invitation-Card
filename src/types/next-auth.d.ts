import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      platformRole: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    platformRole?: "USER" | "ADMIN";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    platformRole?: "USER" | "ADMIN";
  }
}
