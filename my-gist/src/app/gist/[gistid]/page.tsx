'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSessionUser } from '@/hooks/useSessionUser';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AnimatedLoader } from '@/component/AnimatedLoader';

interface GistDetailProps {
  params: {
    gistid: string;
  };
}

interface GistFile {
  filename: string;
  content?: string;
  raw_url: string;
}

interface Gist {
  description: string;
  files: Record<string, GistFile>;
}

const GistDetail = ({ params }: GistDetailProps) => {
  const { accessToken } = useSessionUser();
  const [gist, setGist] = useState<Gist | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGist = async () => {
      if (!accessToken) return;

      try {
        const { data }: { data: Gist } = await axios.get(
          `https://api.github.com/gists/${params.gistid}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );

        setGist(data);

        const firstFileKey = Object.keys(data.files)[0];
        const file = data.files[firstFileKey];

        if (file.content) {
          setContent(file.content);
        } else {
          const res = await axios.get(file.raw_url);
          setContent(res.data);
        }
      } catch (err) {
        console.error('Failed to load gist:', err);
      }
    };

    fetchGist();
  }, [accessToken, params.gistid]);

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this gist?');
    if (!confirmed || !accessToken) return;

    try {
      await axios.delete(`https://api.github.com/gists/${params.gistid}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      router.push('/my-gists');
    } catch (err) {
      console.error('Failed to delete gist:', err);
    }
  };

  if (!gist) {
    return (
      <AnimatedLoader />
    );
  }

  const filename = Object.keys(gist.files)[0];

  return (
    <motion.div
      className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl space-y-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 break-words">
          {gist.description || (
            <span className="italic text-gray-400">No description provided</span>
          )}
        </h1>

        <h2 className="text-lg font-semibold text-gray-600">
          📄 File: <span className="text-gray-800">{filename}</span>
        </h2>

        <pre className="bg-gray-100 border border-gray-300 text-sm p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-[500px]">
          {content ?? 'Loading file content...'}
        </pre>

        <div className="flex flex-col sm:flex-row justify-start gap-4 pt-4">
          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto cursor-pointer"
          >
            🗑️ Delete
          </motion.button>

          <motion.button
            onClick={() => router.push(`/gist/${params.gistid}/edit`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition w-full sm:w-auto cursor-pointer"
          >
            ✏️ Edit
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GistDetail;
