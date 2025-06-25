'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface GistUserClientProps {
  userData: {
    login: string;
    name: string | null;
    avatar_url: string;
  } | null;
  gists?: {
    id: string;
    html_url: string;
    description: string | null;
    files: {
      [key: string]: {
        filename: string;
        raw_url: string;
      };
    };
  }[];
  username: string;
}

interface GistWithContent {
  id: string;
  description: string | null;
  filename: string;
  raw_url: string;
  html_url: string;
  content: string;
}

const GistUserClient = ({
  userData,
  gists = [],
  username,
}: GistUserClientProps) => {
  const [gistsWithContent, setGistsWithContent] = useState<GistWithContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      try {
        const promises = gists.map(async (gist) => {
          const fileKey = Object.keys(gist.files)[0];
          const file = gist.files[fileKey];

          const res = await fetch(file.raw_url);
          const text = await res.text();

          return {
            id: gist.id,
            description: gist.description,
            filename: file.filename,
            raw_url: file.raw_url,
            html_url: gist.html_url,
            content: text,
          };
        });

        const results = await Promise.all(promises);
        setGistsWithContent(results);
      } catch (err) {
        console.error('Failed to load gist contents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [gists]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        {userData ? (
          <>
            <Image
              src={userData.avatar_url}
              alt={`${userData.login}'s avatar`}
              width={60}
              height={60}
              className="rounded-full border"
            />
            <div>
              <h1 className="text-2xl font-bold">
                {userData.name ?? userData.login}
              </h1>
              <p className="text-gray-500">@{userData.login}</p>
            </div>
          </>
        ) : (
          <div className="text-red-600 font-semibold">User not found</div>
        )}
      </div>

      {/* Gists */}
      {loading ? (
        <p className="text-gray-500">Loading gists…</p>
      ) : gistsWithContent.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {gistsWithContent.map((gist) => (
            <motion.div
              key={gist.id}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow hover:shadow-lg transition p-5 border border-gray-200 dark:border-neutral-700 overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-blue-600 font-semibold break-words">
                {gist.filename}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {gist.description ?? (
                  <span className="italic">No description</span>
                )}
              </p>

              <pre className="text-sm bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 rounded p-3 max-h-64 overflow-auto whitespace-pre-wrap">
                {gist.content.slice(0, 500)}
                {gist.content.length > 500 && (
                  <span className="text-gray-400">... (truncated)</span>
                )}
              </pre>

              <Link
                href={gist.html_url}
                target="_blank"
                className="text-xs text-blue-500 hover:underline mt-2 inline-block"
              >
                View on GitHub →
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-gray-500 italic">
          No public gists found for @{username}.
        </p>
      )}
    </div>
  );
};

export default GistUserClient;
