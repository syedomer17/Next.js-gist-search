/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

// authOptions contains runtime-only fields and some loose types; cast to any
// to satisfy NextAuth's compile-time AuthOptions type in this app-router route.
const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
