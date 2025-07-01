"use client";
import { useEffect, useState } from "react";

interface GistComment {
  id: number;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
}

export default function CommentSection({ gistId }: { gistId: string }) {
  const [comments, setComments] = useState<GistComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const res = await fetch(`/api/gists/${gistId}/comments`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [gistId]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLoading(true);

    const res = await fetch(`/api/gists/${gistId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: commentText }),
    });

    if (res.ok) {
      setCommentText("");
      await fetchComments();
    } else {
      alert("Failed to post comment");
    }

    setLoading(false);
  };

  return (
    <div className="mt-8 space-y-4">
      <form onSubmit={submitComment} className="space-y-2">
        <textarea
          rows={3}
          className="w-full p-2 border rounded"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="text-gray-500 italic">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-100 p-3 rounded border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <img
                src={comment.user.avatar_url}
                alt="avatar"
                className="w-6 h-6 rounded-full"
              />
              <span className="font-semibold">{comment.user.login}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <p>{comment.body}</p>
          </div>
        ))
      )}
    </div>
  );
}
