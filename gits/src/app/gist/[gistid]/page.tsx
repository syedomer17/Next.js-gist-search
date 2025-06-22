"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface GistFile {
  filename: string;
  content: string;
}

interface GistApiResponse {
  description: string;
  files: Record<string, { filename: string; content: string }>;
  owner: { login: string };
}

export default function GistDetailPage() {
  const { gistId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<GistFile[]>([]);
  const [originalFiles, setOriginalFiles] = useState<GistFile[]>([]);
  const [originalDescription, setOriginalDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gistId || !token) return;

    async function fetchGist() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://api.github.com/gists/${gistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch gist");
        }
        const gist: GistApiResponse = await res.json();

        setDescription(gist.description || "");
        // Convert files object to array with content
        const filesArr = Object.values(gist.files).map((f) => ({
          filename: f.filename,
          content: f.content || "",
        }));

        setFiles(filesArr);
        setOriginalFiles(filesArr);
        setOriginalDescription(gist.description || "");
      } catch (err: any) {
        setError(err.message || "Error fetching gist");
      } finally {
        setLoading(false);
      }
    }
    fetchGist();
  }, [gistId, token]);

  // Search highlight helper
  function highlightContent(content: string) {
    if (!searchTerm.trim()) return content;

    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");

    return content.replace(
      regex,
      '<mark style="background:#fef3c7; border-radius:2px;">$1</mark>'
    );
  }

  // Save changes handler
  async function handleSave() {
    if (!token || !gistId) {
      setError("Not authenticated or gistId missing.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Prepare files object for PATCH
      const filesObj: Record<string, { content: string }> = {};
      files.forEach((f) => {
        filesObj[f.filename] = { content: f.content };
      });

      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
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

      // Update originals to current after success
      setOriginalFiles(files);
      setOriginalDescription(description);
      alert("Gist updated successfully!");
    } catch (err: any) {
      setError(err.message || "Error updating gist");
    } finally {
      setLoading(false);
    }
  }

  // Undo changes handler
  function handleUndo() {
    setFiles(originalFiles);
    setDescription(originalDescription);
  }

  // Delete gist handler
  async function handleDelete() {
    if (!token || !gistId) {
      setError("Not authenticated or gistId missing.");
      return;
    }
    if (!confirm("Are you sure you want to delete this gist? This action cannot be undone.")) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) {
        alert("Gist deleted successfully.");
        router.push("/");
      } else {
        throw new Error("Failed to delete gist");
      }
    } catch (err: any) {
      setError(err.message || "Error deleting gist");
    } finally {
      setLoading(false);
    }
  }

  // Update file content by index
  function updateFileContent(index: number, newContent: string) {
    setFiles((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], content: newContent };
      return copy;
    });
  }

  // Update filename by index
  function updateFilename(index: number, newFilename: string) {
    setFiles((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], filename: newFilename };
      return copy;
    });
  }

  if (status === "loading" || loading) {
    return <div className="p-6 text-center">Loading gist...</div>;
  }

  if (!session) {
    return (
      <div className="p-6 text-center text-red-600">
        You must be logged in to view/edit this gist.
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Gist Detail & Edit</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <label className="block mb-1 font-semibold">Description</label>
      <input
        type="text"
        className="w-full border p-2 rounded mb-6"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Gist description"
      />

      {files.map((file, idx) => (
        <div key={idx} className="mb-8 border p-4 rounded">
          <label className="block mb-1 font-semibold">Filename</label>
          <input
            type="text"
            className="w-full border p-1 rounded mb-2"
            value={file.filename}
            onChange={(e) => updateFilename(idx, e.target.value)}
          />

          <label className="block mb-1 font-semibold">Content</label>
          <textarea
            rows={10}
            className="w-full border p-2 font-mono text-sm rounded"
            value={file.content}
            onChange={(e) => updateFileContent(idx, e.target.value)}
            placeholder="File content"
          />

          {searchTerm.trim() && (
            <div
              className="mt-2 p-2 bg-yellow-100 rounded overflow-auto max-h-48 whitespace-pre-wrap font-mono text-xs"
              dangerouslySetInnerHTML={{ __html: highlightContent(file.content) }}
              ref={contentRef}
            />
          )}
        </div>
      ))}

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Search in content</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="Search term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Save Changes
        </button>
        <button
          onClick={handleUndo}
          disabled={loading}
          className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Undo Changes
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          Delete Gist
        </button>
      </div>
    </main>
  );
}
