"use client";

import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { AnimatedLoader } from "@/component/AnimatedLoader";

interface Gist {
  id: string;
  description: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  files: {
    [key: string]: {
      filename: string;
    };
  };
}

const GistUserPage = () => {
  const { data: session, status } = useSession();
  const params = useParams();

  const usernameParam =
    typeof params.username === "string"
      ? params.username
      : Array.isArray(params.username)
      ? params.username[0]
      : null;

  const [gists, setGists] = useState<Gist[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchGists = async () => {
      if (!usernameParam) return;

      setLoading(true);

      try {
        const isSelf = session?.username === usernameParam;
        const url = isSelf
          ? `https://api.github.com/gists`
          : `https://api.github.com/users/${usernameParam}/gists`;

        const headers = isSelf
          ? {
              Authorization: `token ${session?.accessToken}`,
              Accept: "application/vnd.github+json",
            }
          : {};

        const { data } = await axios.get<Gist[]>(url, { headers });
        setGists(data);
      } catch (err) {
        console.error("Failed to fetch gists:", err);
        setGists([]);
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchGists();
    }
  }, [usernameParam, session, status]);

  if (!usernameParam || loading || gists === null) {
    return <AnimatedLoader />;
  }

  // Filter logic
  const filteredGists = gists.filter((gist) => {
    const descriptionMatch = gist.description?.toLowerCase().includes(debouncedSearch);
    const filenameMatch = Object.keys(gist.files).some((filename) =>
      filename.toLowerCase().includes(debouncedSearch)
    );
    return descriptionMatch || filenameMatch;
  });

  return (
    <motion.div
      className="px-4 py-8 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {usernameParam.charAt(0).toUpperCase() + usernameParam.slice(1)}&apos;s Gists
      </h1>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by filename or description..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      {filteredGists.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No gists found matching your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGists.map((gist) => (
            <Link
              key={gist.id}
              href={`/gist/${gist.id}`} // ✅ CORRECTED LINK HERE
              className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={gist.owner.avatar_url}
                    alt={gist.owner.login}
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-gray-800 truncate">{gist.owner.login}</p>
                    <p className="text-sm text-gray-400">
                      ID: {gist.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 font-medium mb-2 truncate">
                  {gist.description || (
                    <span className="italic text-gray-400">No description</span>
                  )}
                </p>

                <p className="text-sm text-blue-500 group-hover:underline">
                  View Gist →
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default GistUserPage;
