"use client";

import Image from "next/image";
import { useSessionUser } from "@/hooks/useSessionUser";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, status, accessToken } = useSessionUser();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (accessToken) {
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then(setProfile);
    }
  }, [accessToken]);

  if (status === "loading") return <p>Loading…</p>;
  if (!user) {
    return (
      <button onClick={() => signIn("github")} className="bg-black text-white p-2">
        Sign in with GitHub
      </button>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {profile && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src={profile.avatar_url}
              alt="User Avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{profile.name || profile.login}</p>
              <p className="text-gray-500 text-sm">@{profile.login}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      )}

      <button onClick={() => router.push("/my-gists")} className="underline text-blue-600">
        View My Gists
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/user-gists/${input.trim()}`);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter GitHub username"
          className="border px-2 py-1 rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          Search
        </button>
      </form>

      <button
        onClick={() => router.push("/gist/create")}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create New Gist
      </button>
    </div>
  );
}
