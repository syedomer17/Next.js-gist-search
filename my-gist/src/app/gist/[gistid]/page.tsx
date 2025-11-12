"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AnimatedLoader } from "@/component/AnimatedLoader";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface GistDetailProps { params: any }

interface GistFile {
  filename: string;
  content?: string;
  raw_url: string;
}

interface Gist {
  description: string;
  files: Record<string, GistFile>;
}

interface GistComment {
  id: number;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
}

const GistDetail = ({ params }: GistDetailProps) => {
  const gistId = (params as { gistid: string }).gistid;
  const { accessToken, session } = useSessionUser();
  const [gist, setGist] = useState<Gist | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [comments, setComments] = useState<GistComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const router = useRouter();

  // Fetch Gist details
  useEffect(() => {
    const fetchGist = async () => {
      if (!accessToken) return;
      try {
        const { data } = await axios.get<Gist>(
          `https://api.github.com/gists/${gistId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setGist(data);

        const fileKey = Object.keys(data.files)[0];
        const file = data.files[fileKey];

        if (file.content) {
          setContent(file.content);
        } else {
          const res = await axios.get(file.raw_url);
          setContent(res.data);
        }
      } catch (err) {
        console.error("Failed to load gist:", err);
      }
    };

    fetchGist();
  }, [accessToken, gistId]);

  // Fetch comments
  const loadComments = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res = await axios.get<GistComment[]>(
        `https://api.github.com/gists/${gistId}/comments`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  }, [accessToken, gistId]);

  useEffect(() => {
    loadComments();
  }, [accessToken, gistId, loadComments]);

  // Handle comment post
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !accessToken) return;

    setCommentLoading(true);
    try {
      await axios.post(
        `/api/gists/${gistId}/comments`,
        { body: commentText },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setCommentText("");
      await loadComments(); // Reload comments after post
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this gist?");
    if (!confirmed || !accessToken) return;

    try {
      await axios.delete(`https://api.github.com/gists/${gistId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Use session.username if available, fallback to /my-gists
      const username = (session as { username?: string })?.username;
      if (username) {
        router.push(`/my-gists/${username}`);
      } else {
        router.push("/my-gists");
      }
    } catch (err) {
      console.error("Failed to delete gist:", err);
    }
  };

  if (!gist) return <AnimatedLoader />;

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
            <span className="italic text-gray-400">
              No description provided
            </span>
          )}
        </h1>

        <h2 className="text-lg font-semibold text-gray-600">
          📄 File: <span className="text-gray-800">{filename}</span>
        </h2>

        <pre className="bg-gray-100 border border-gray-300 text-sm p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-[500px]">
          {content ?? "Loading file content..."}
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
            onClick={() => router.push(`/gist/${gistId}/edit`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition w-full sm:w-auto cursor-pointer"
          >
            ✏️ Edit
          </motion.button>
        </div>

        {/* Comment Form */}
        <form onSubmit={handlePostComment} className="space-y-2 mt-6">
          <textarea
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            disabled={commentLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {commentLoading ? "Posting..." : "Post Comment"}
          </button>
        </form>

        {/* Comments */}
        <div className="space-y-4 mt-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-100 p-3 rounded border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Image
                    src={comment.user.avatar_url}
                    alt="avatar"
                    width={24} // corresponds to w-6
                    height={24} // corresponds to h-6
                    className="rounded-full"
                  />
                  <span className="font-semibold text-sm">
                    {comment.user.login}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-800">{comment.body}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GistDetail;
