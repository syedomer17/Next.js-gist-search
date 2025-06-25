'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useSessionUser } from '@/hooks/useSessionUser';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface GistFile {
  filename: string;
  content: string;
}

interface GistResponse {
  description: string;
  files: {
    [key: string]: GistFile;
  };
}

interface EditGistProps {
  params: {
    gistid: string;
  };
}

const EditGist = ({ params }: EditGistProps) => {
  const { accessToken } = useSessionUser();
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState('');
  const [originalFilename, setOriginalFilename] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchGist = async () => {
      try {
        const { data }: { data: GistResponse } = await axios.get(
          `https://api.github.com/gists/${params.gistid}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );

        const fileKey = Object.keys(data.files)[0];
        setFilename(fileKey);
        setOriginalFilename(fileKey);
        setContent(data.files[fileKey].content);
        setDescription(data.description || '');
      } catch (err) {
        console.error('Error fetching gist:', err);
      }
    };

    if (accessToken) fetchGist();
  }, [accessToken, params.gistid]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const files: Record<string, { content?: string } | null> = {
      ...(filename !== originalFilename && { [originalFilename]: null }),
      [filename]: { content }
    };

    try {
      await axios.patch(
        `https://api.github.com/gists/${params.gistid}`,
        {
          description,
          files
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      router.push(`/gist/${params.gistid}`);
    } catch (err) {
      console.error('Error updating gist:', err);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl space-y-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center">Edit Gist</h1>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <input
            value={description}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Filename</label>
          <input
            value={filename}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilename(e.target.value)}
            placeholder="filename.ext"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">File Content</label>
          <textarea
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="Enter file content here..."
            rows={10}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          💾 Save Changes
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default EditGist;
