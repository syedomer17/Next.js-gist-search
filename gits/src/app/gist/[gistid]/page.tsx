"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface GistFile {
  filename: string;
  content: string;
}

export default function GistDetailPage() {
  const { gistId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<GistFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!gistId) return;

    const fetchGist = async () => {
      try {
        const res = await axios.get(`/api/gists/${gistId}`);
        const gist = res.data;

        setDescription(gist.description || "");

        const fileList = await Promise.all(
          Object.values(gist.files).map(async (f: any) => {
            let content = f.content;
            if (!content && f.raw_url) {
              const raw = await axios.get(f.raw_url);
              content = raw.data;
            }
            return { filename: f.filename, content };
          })
        );

        setFiles(fileList);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load gist.");
      } finally {
        setLoading(false);
      }
    };

    fetchGist();
  }, [gistId]);

  const handleSave = async () => {
    try {
      await axios.patch(`/api/gists/${gistId}`, {
        description,
        files: Object.fromEntries(files.map((f) => [f.filename, { content: f.content }])),
      });
      alert("Saved!");
    } catch (err: any) {
      alert(err.response?.data?.error || "Save failed");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this gist?")) return;
    try {
      await axios.delete(`/api/gists/${gistId}`);
      alert("Deleted!");
      router.push("/");
    } catch (err: any) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  if (loading || status === "loading") return <div className="p-4">Loading...</div>;
  if (!session) return <div className="p-4 text-red-600">Login required</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Edit Gist</h1>
      {error && <div className="text-red-500">{error}</div>}

      <label>Description</label>
      <input
        className="w-full border p-2 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {files.map((file, idx) => (
        <div key={idx} className="border p-4 mt-4 rounded space-y-2">
          <input
            className="w-full border p-2"
            value={file.filename}
            onChange={(e) => {
              const copy = [...files];
              copy[idx].filename = e.target.value;
              setFiles(copy);
            }}
          />
          <textarea
            className="w-full border p-2 font-mono"
            rows={10}
            value={file.content}
            onChange={(e) => {
              const copy = [...files];
              copy[idx].content = e.target.value;
              setFiles(copy);
            }}
          />
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
          Delete
        </button>
      </div>
    </div>
  );
}
