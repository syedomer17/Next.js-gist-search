"use client";
import { useSession } from "next-auth/react";

export function useSessionUser() {
  const { data: session, status } = useSession();
  return { session, status, user: session?.user, accessToken: session?.accessToken! };
}
