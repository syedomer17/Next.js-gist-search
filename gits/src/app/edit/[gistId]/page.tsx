"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface GistFile {
  filename: string;
  content: string;
}

export default function EditGistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { gistId } = useParams();

  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<GistFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchGist = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.github.com/gists/${gistId}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch gist");
        const gist = await res.json();

        setDescription(gist.description || "");

        const fileEntries = Object.entries(gist.files).map(([filename, file]: any) => ({
          filename,
          content: file.content,
        }));

        setFiles(fileEntries);
      } catch (err: any) {
        setError(err.message || "Error loading gist");
      } finally {
        setLoading(false);
      }
    };

    fetchGist();
  }, [gistId, session?.accessToken]);

  const handleFileChange = (index: number, key: "filename" | "content", value: string) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.accessToken) {
      setError("You must be logged in.");
      return;
    }

    if (files.length === 0 || files.some((f) => !f.filename.trim() || !f.content.trim())) {
      setError("All files must have filename and content.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const filesObj: Record<string, { content: string }> = {};
      files.forEach((f) => {
        filesObj[f.filename] = { content: f.content };
      });

      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          files: filesObj,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update gist");
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!session?.accessToken) {
      setError("You must be logged in.");
      return;
    }
    if (!confirm("Are you sure you want to delete this gist? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (res.status !== 204) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete gist");
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="p-6 text-center">
        <p>You must be logged in to edit or delete gists.</p>
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Gist</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block font-semibold mb-1">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded-md"
            placeholder="Brief gist description"
          />
        </div>

        {files.map((file, index) => (
          <div key={index} className="border p-4 rounded-md mb-4">
            <label className="block font-semibold mb-1">
              Filename <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={file.filename}
              onChange={(e) => handleFileChange(index, "filename", e.target.value)}
              required
              className="w-full border p-2 rounded-md mb-2"
            />

            <label className="block font-semibold mb-1">
              Content <span className="text-red-600">*</span>
            </label>
            <textarea
              value={file.content}
              onChange={(e) => handleFileChange(index, "content", e.target.value)}
              required
              rows={8}
              className="w-full border p-2 rounded-md font-mono"
              placeholder="Gist file content"
            />
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700"
          >
            Delete Gist
          </button>
        </div>
      </form>
    </main>
  );
}
