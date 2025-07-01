// components/CommentList.tsx
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

export interface GistComment {
  id: number;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
}

export default function CommentList({ comments }: { comments: GistComment[] }) {
  if (!comments?.length) {
    return <p className="text-gray-500 italic">No comments yet.</p>;
  }

  return (
    <div className="space-y-4 mt-6">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center mb-2 gap-2">
            <img
              src={comment.user.avatar_url}
              className="w-6 h-6 rounded-full"
              alt="avatar"
            />
            <span className="font-semibold">{comment.user.login}</span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at))} ago
            </span>
          </div>
          <p>{comment.body}</p>
        </div>
      ))}
    </div>
  );
}
