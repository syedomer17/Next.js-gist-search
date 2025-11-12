"use client";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

export function useSessionUser() {
  const { data: session, status } = useSession();
  return {
    session,
    status,
    user: session?.user,
    accessToken: (session as Session)?.accessToken,
  };
}


