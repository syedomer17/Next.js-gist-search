"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CommentForm({ gistId }: { gistId: string }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);

    const res = await fetch(`/api/gists/${gistId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: comment }),
    });

    if (res.ok) {
      setComment("");
      router.refresh(); // Re-fetch server component
    } else {
      alert("Failed to post comment");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={submitComment} className="space-y-2">
      <textarea
        rows={3}
        className="w-full p-2 border rounded"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
