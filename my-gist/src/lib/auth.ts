/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/auth.ts
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
  GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "gist read:user" } },
      profile(profile: unknown) {
        return {
          id: String((profile as any).id),
          name: (profile as any).name || (profile as any).login,
          email: (profile as any).email,
          image: (profile as any).avatar_url,
          login: (profile as any).login,
        } as any;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account, user }: { token: unknown; account?: unknown; user?: unknown }) {
      if (account && user) {
        (token as any).accessToken = (account as any).access_token;
        (token as any).username = (user as any).login;
        (token as any).picture = (user as any).image;
      }
      return token as any;
    },
    async session({ session, token }: { session: unknown; token: unknown }) {
      (session as any).accessToken = (token as any).accessToken as string;
      (session as any).username = (token as any).username as string;
      if ((session as any).user) {
        (session as any).user.image = (token as any).picture as string;
      }
      return session as any;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
