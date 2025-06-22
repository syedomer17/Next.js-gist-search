// /types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { GitHubProfile } from "next-auth/providers/github";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    avatar_url?: string;
  }

  interface User {
    avatar_url?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    avatar_url?: string;
  }
}

declare module "next-auth/providers/github" {
  interface GitHubProfile {
    avatar_url: string;
  }
}
