"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";

interface Gist {
  id: string;
  html_url: string;
  description: string;
  files: Record<string, any>;
}

export default function HomePage() {
  const { data: session, status } = useSession();

  const [userGists, setUserGists] = useState<Gist[]>([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchGists, setSearchGists] = useState<Gist[]>([]);
  const [loadingUserGists, setLoadingUserGists] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Fetch logged-in user’s gists (public + private)
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

  // Search public gists by username
  const handleSearch = async () => {
    if (!searchUsername.trim()) {
      setSearchGists([]);
      setSearchError("Please enter a GitHub username.");
      return;
    }
    setLoadingSearch(true);
    setSearchError("");
    try {
      const res = await axios.get(
        `https://api.github.com/users/${searchUsername}/gists`
      );
      setSearchGists(res.data);
    } catch (error: any) {
      setSearchError(
        error.response?.status === 404
          ? "User not found."
          : "Failed to fetch gists."
      );
      setSearchGists([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  if (status === "loading") {
    return <div className="p-6 text-center">Loading session...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Auth Buttons */}
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={session.avatar_url}
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
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
      )}

      {/* User’s own gists */}
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
                  <a
                    href={gist.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Gist
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Search public gists by GitHub username */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Search Public Gists by Username</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            className="flex-grow border p-2 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
        {loadingSearch && <p>Searching gists...</p>}
        {searchError && <p className="text-red-600">{searchError}</p>}
        {searchGists.length > 0 && (
          <ul className="space-y-3">
            {searchGists.map((gist) => (
              <li key={gist.id} className="border p-3 rounded-md">
                <h3 className="font-semibold mb-1">
                  {gist.description || "No description"}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Files: {Object.keys(gist.files).join(", ")}
                </p>
                <a
                  href={gist.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Gist
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
