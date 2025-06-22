"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserGists } from "@/lib/github";

export default function Dashboard() {
  const { data: session } = useSession();
  const [gists, setGists] = useState([]);

  useEffect(() => {
    if (session?.accessToken) {
      getUserGists(session.accessToken).then(setGists);
    }
  }, [session]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Gists</h1>
      <ul className="grid grid-cols-1 gap-4">
        {gists.map((gist: any) => (
          <li key={gist.id} className="p-4 border rounded-md">
            <h2 className="font-semibold">{gist.description || "No description"}</h2>
            <a href={gist.html_url} target="_blank" className="text-blue-600 underline">
              View Gist
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
