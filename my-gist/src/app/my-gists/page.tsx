// src/app/user-gists/[username]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedLoader } from '@/component/AnimatedLoader';

interface Gist {
  id: string;
  description: string;
  owner: {
    avatar_url: string;
    login: string;
  };
}

const GistUserPage = () => {
  const { username } = useParams();
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGists = async () => {
      if (!username) return;

      try {
        const { data } = await axios.get<Gist[]>(`https://api.github.com/users/${username}/gists`);
        setGists(data);
      } catch (err) {
        console.error('Failed to fetch gists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGists();
  }, [username]);

  if (loading) {
    return <AnimatedLoader />;
  }

  return (
    <motion.div
      className="px-4 py-8 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        {username}&apos;s Gists
      </h1>

      {gists.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No public gists found for @{username}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gists.map((gist) => (
            <Link key={gist.id} href={`/gist/${gist.id}`} className="group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={gist.owner?.avatar_url}
                    alt={gist.owner?.login}
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-gray-800 truncate">{gist.owner?.login}</p>
                    <p className="text-sm text-gray-400">ID: {gist.id.slice(0, 8)}...</p>
                  </div>
                </div>

                <p className="text-gray-700 font-medium mb-2 truncate">
                  {gist.description || <span className="italic text-gray-400">No description</span>}
                </p>

                <p className="text-sm text-blue-500 group-hover:underline">View Gist →</p>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default GistUserPage;