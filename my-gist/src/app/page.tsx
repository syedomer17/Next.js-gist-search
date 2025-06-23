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
      <div className="flex justify-center items-center h-screen">
        <button
          onClick={() => signIn("github")}
          className="bg-black text-white px-6 py-2 rounded shadow-md hover:bg-gray-800 transition-transform transform hover:scale-105 cursor-pointer"
        >
          Sign in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      {profile && (
        <div className="flex justify-between items-center bg-white shadow p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <Image
              src={profile.avatar_url}
              alt="User Avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold text-lg">{profile.name || profile.login}</p>
              <p className="text-gray-500 text-sm">@{profile.login}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-transform transform hover:scale-105 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )}

      <button
        onClick={() => router.push("/my-gists")}
        className="text-blue-600 underline hover:text-blue-800 transition-colors cursor-pointer"
      >
        View My Gists
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/user-gists/${input.trim()}`);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter GitHub username"
          className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-transform transform hover:scale-105 cursor-pointer"
        >
          Search
        </button>
      </form>

      <button
        onClick={() => router.push("/gist/create")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-transform transform hover:scale-105 cursor-pointer"
      >
        Create New Gist
      </button>
    </div>
  );
}
