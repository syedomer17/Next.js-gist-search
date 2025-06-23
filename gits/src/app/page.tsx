"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface Gist {
  id: string;
  html_url: string;
  description: string;
  files: Record<string, any>;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userGists, setUserGists] = useState<Gist[]>([]);
  const [loadingUserGists, setLoadingUserGists] = useState(false);

  const [username, setUsername] = useState("");

  // Fetch logged-in user's gists (public + private)
  useEffect(() => {
    if (session?.accessToken) {
      setLoadingUserGists(true);
      axios
        .get("https://api.github.com/gists", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })
        .then((res) => setUserGists(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingUserGists(false));
    } else {
      setUserGists([]);
    }
  }, [session?.accessToken]);

  const handleSearch = () => {
    if (username.trim()) {
      router.push(`/search/${username.trim()}`);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (status === "loading") {
    return <div className="p-6 text-center">Loading session...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-10">
      {/* Auth Section */}
      {!session ? (
        <div className="text-center">
          <button
            onClick={() => signIn("github")}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
          >
            Sign in with GitHub
          </button>
        </div>
      ) : (
        <>
          {/* User Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-semibold">{session.user?.name}</p>
                <p className="text-sm text-gray-600">{session.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="text-red-600 hover:underline"
            >
              Sign out
            </button>
          </div>

          {/* 🔍 Search Gists by Username - moved here */}
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              Search Public Gists by Username
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleEnter}
                className="flex-grow border p-2 rounded-md"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </section>
        </>
      )}

      {/* User's Own Gists */}
      {session && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Gists</h2>
          {loadingUserGists ? (
            <p>Loading your gists...</p>
          ) : userGists.length === 0 ? (
            <p>No gists found.</p>
          ) : (
            <ul className="space-y-3">
              {userGists.map((gist) => (
                <li key={gist.id} className="border p-3 rounded-md">
                  <h3 className="font-semibold mb-1">
                    {gist.description || "No description"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Files: {Object.keys(gist.files).join(", ")}
                  </p>
                  <Link
                    href={`/gist/${gist.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
