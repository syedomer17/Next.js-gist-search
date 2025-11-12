import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: NextRequest, { params }: any) {
  const { gistid } = params;

  // authOptions contains runtime-only fields and loose callback shapes; cast to any
  // so TypeScript doesn't enforce AuthOptions at this call site.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = await getServerSession(authOptions as any) as Session;

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { body } = await req.json();

  const res = await fetch(`https://api.github.com/gists/${gistid}/comments`, {
    method: "POST",
    headers: {
      Authorization: `token ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
