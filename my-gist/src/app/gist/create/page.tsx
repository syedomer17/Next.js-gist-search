'use client';
import { useState } from "react";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useRouter } from "next/navigation";

export default function CreateGist() {
  const { accessToken } = useSessionUser();
  const [desc, setDesc] = useState("");
  const [filename, setName] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        description: desc,
        public: isPublic,
        files: { [filename]: { content } }
      })
    });

    const data = await res.json();
    if (res.ok) {
      router.push(`/gist/${data.id}`);
    } else {
      alert("Failed to create gist.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow-md rounded-lg"
    >
      <h1 className="text-2xl font-bold">Create Gist</h1>

      <input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Description"
        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      <input
        value={filename}
        onChange={(e) => setName(e.target.value)}
        placeholder="filename.ext"
        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="File content"
        rows={8}
        className="w-full border border-gray-300 px-4 py-2 rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="cursor-pointer"
        />
        Public
      </label>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-transform transform hover:scale-105 cursor-pointer"
      >
        Create
      </button>
    </form>
  );
}
