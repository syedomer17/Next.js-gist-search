'use client';
import { useState, useEffect } from "react";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useRouter } from "next/navigation";

export default function EditGist({ params }: any) {
  const { accessToken } = useSessionUser();
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [filename, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      fetch(`https://api.github.com/gists/${params.gistid}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
        .then(r => r.json())
        .then(g => {
          const f = Object.keys(g.files)[0];
          setName(f);
          setContent(g.files[f].content);
          setDesc(g.description || "");
        });
    }
  }, [accessToken]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch(`https://api.github.com/gists/${params.gistid}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        description: desc,
        files: { [filename]: { content } }
      })
    });
    router.push(`/gist/${params.gistid}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow-md rounded-lg"
    >
      <h1 className="text-2xl font-bold">Edit Gist</h1>

      <input
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="Description"
        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      <p className="text-sm text-gray-500">Editing file: <strong>{filename}</strong></p>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Update file content"
        rows={10}
        className="w-full border border-gray-300 px-4 py-2 rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-transform transform hover:scale-105 cursor-pointer"
      >
        Save Changes
      </button>
    </form>
  );
}
