'use client';

import Image from 'next/image';
import { useSessionUser } from '@/hooks/useSessionUser';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AnimatedLoader } from '@/component/AnimatedLoader';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
}

const Home = () => {
  const { user, status, accessToken } = useSessionUser();
  const router = useRouter();

  const [input, setInput] = useState('');
  const [profile, setProfile] = useState<GitHubUser | null>(null);

  useEffect(() => {
    const fetchGitHubProfile = async () => {
      if (!accessToken) return;

      try {
        const { data } = await axios.get<GitHubUser>('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchGitHubProfile();
  }, [accessToken]);

  if (status === 'loading') {
    return <AnimatedLoader />
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => signIn('github')}
          className="bg-black cursor-pointer text-white px-8 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition"
        >
          Sign in with GitHub
        </motion.button>
      </div>
    );
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      router.push(`/user-gists/${input.trim()}`);
    }
  };

  return (
    <motion.div
      className="p-6 space-y-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {profile && (
        <motion.div
          className="flex justify-between items-center bg-white shadow-lg p-4 rounded-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut()}
            className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Sign Out
          </motion.button>
        </motion.div>
      )}

      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/my-gists')}
          className="bg-blue-100 text-blue-700 font-medium px-6 py-3 rounded-lg border border-blue-200 hover:bg-blue-200 transition cursor-pointer"
        >
          View My Gists
        </motion.button>

        <form onSubmit={handleSearch} className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Enter GitHub username"
            className="flex-grow border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-500 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Search
          </motion.button>
        </form>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/gist/create')}
          className="bg-green-600 text-white px-6 py-3 cursor-pointer rounded-lg hover:bg-green-700 transition"
        >
          Create New Gist
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Home;
