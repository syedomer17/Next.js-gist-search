"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateGistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return <div className="p-6 text-center">Loading session...</div>;
  }

  if (!session) {
    return (
      <div className="p-6 text-center">
        <p>You must be logged in to create a gist.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!filename.trim() || !content.trim()) {
      setError("Filename and content are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description || "",
          public: true,
          files: {
            [filename]: {
              content: content,
            },
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create gist");
      }

      // Success, redirect to homepage or to the new gist URL if you want:
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Gist</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1" htmlFor="description">
            Description (optional)
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief gist description"
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="filename">
            Filename <span className="text-red-600">*</span>
          </label>
          <input
            id="filename"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="example.js"
            required
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="content">
            Content <span className="text-red-600">*</span>
          </label>
          <textarea
            id="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your gist content here..."
            required
            className="w-full border p-2 rounded-md font-mono"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Gist"}
        </button>
      </form>
    </main>
  );
}
