"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function CreateGist() {
  const { data: session } = useSession();

  const [description, setDescription] = useState("");
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.accessToken) {
      setMessage("You must be logged in to create a gist.");
      return;
    }

    if (!filename.trim() || !content.trim()) {
      setMessage("Filename and content cannot be empty.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const body = {
        description,
        public: true,
        files: {
          [filename]: { content },
        },
      };

      const res = await axios.post("https://api.github.com/gists", body, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (res.status === 201) {
        setMessage("Gist created successfully!");
        setDescription("");
        setFilename("");
        setContent("");
      } else {
        setMessage("Failed to create gist.");
      }
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4 border rounded-md">
      <h2 className="text-xl font-semibold mb-4">Create New Gist</h2>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Filename (e.g. script.js)"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={6}
        className="w-full border p-2 rounded font-mono"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Gist"}
      </button>
      {message && <p className="mt-2 text-center">{message}</p>}
    </form>
  );
}
