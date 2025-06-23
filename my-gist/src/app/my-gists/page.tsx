'use client';
import { useEffect, useState } from "react";
import { useSessionUser } from "@/hooks/useSessionUser";
import Link from "next/link";

export default function MyGistsPage() {
  const { accessToken, status } = useSessionUser();
  const [gists, setGists] = useState<any[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    fetch("https://api.github.com/gists", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(setGists);
  }, [accessToken]);

  if (status === "loading") return <p>Loading…</p>;

  return (
    <div className="p-6">
      <h1>My Gists</h1>
      {gists.map((g) => (
        <Link key={g.id} href={`/gist/${g.id}`}>
          <div className="border p-4 rounded">{g.description || 'No description'}</div>
        </Link>
      ))}
    </div>
  );
}
