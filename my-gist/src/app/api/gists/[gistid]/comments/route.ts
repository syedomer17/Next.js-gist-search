import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { gistid: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { body } = await req.json();

  const res = await fetch(`https://api.github.com/gists/${params.gistid}/comments`, {
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
