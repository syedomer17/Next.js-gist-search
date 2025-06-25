'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useSessionUser } from '@/hooks/useSessionUser';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const CreateGist = () => {
  const { accessToken } = useSessionUser();
  const router = useRouter();

  const [desc, setDesc] = useState('');
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://api.github.com/gists',
        {
          description: desc,
          public: isPublic,
          files: {
            [filename]: { content }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      router.push(`/gist/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create gist:', error);
      alert('Failed to create gist.');
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gray-100 px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl space-y-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">Create a New Gist</h1>

        <input
          value={desc}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDesc(e.target.value)}
          placeholder="Enter description"
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <input
          value={filename}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilename(e.target.value)}
          placeholder="Enter filename (e.g., index.js)"
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <textarea
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          placeholder="Paste your code or content here..."
          rows={8}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setIsPublic(e.target.checked)}
            className="accent-blue-500 cursor-pointer"
          />
          Make Gist Public
        </label>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          🚀 Create Gist
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default CreateGist;
