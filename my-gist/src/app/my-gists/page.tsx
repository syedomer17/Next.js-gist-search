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

  if (status === "loading") return <p className="text-center mt-10 text-lg">Loading…</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Gists</h1>
      {gists.length === 0 ? (
        <p className="text-gray-500">You haven't created any gists yet.</p>
      ) : (
        <div className="space-y-4">
          {gists.map((g) => (
            <Link key={g.id} href={`/gist/${g.id}`}>
              <div className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition hover:bg-gray-50 cursor-pointer">
                <p className="font-medium text-gray-800">
                  {g.description || <span className="italic text-gray-500">No description</span>}
                </p>
                <p className="text-sm text-gray-400 mt-1">ID: {g.id}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
