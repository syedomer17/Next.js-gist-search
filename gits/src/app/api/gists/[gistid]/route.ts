// app/api/gists/[gistId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function GET(req: NextRequest, { params }: { params: { gistId: string } }) {
  // Extract the token from the cookie/session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.accessToken) {
    return NextResponse.json({ error: "Unauthorized - Missing access token" }, { status: 401 });
  }

  const gistId = params.gistId;

  try {
    // Call GitHub API to fetch gist by ID
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "User-Agent": "Next.js App",
      },
    });

    if (res.status === 404) {
      return NextResponse.json({ error: "Gist not found or access denied" }, { status: 404 });
    }

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.message || "GitHub API error" }, { status: res.status });
    }

    const gist = await res.json();
    return NextResponse.json(gist);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch gist" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { gistId: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = token?.accessToken as string;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const res = await fetch(`https://api.github.com/gists/${params.gistId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Failed to update gist" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { gistId: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = token?.accessToken as string;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`https://api.github.com/gists/${params.gistId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 204) {
      return NextResponse.json({ success: true });
    } else {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.message || "Delete failed" }, { status: res.status });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
