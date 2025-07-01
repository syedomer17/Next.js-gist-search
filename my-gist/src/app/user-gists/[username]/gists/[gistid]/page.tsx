import axios from "axios";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import CommentForm from "@/component/CommentForm";

interface PageProps {
  params: { username: string; gistid: string };
}

interface GitHubGist {
  id: string;
  html_url: string;
  description: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  files: {
    [key: string]: {
      filename: string;
      raw_url: string;
    };
  };
}

interface GistComment {
  id: number;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Gist ${params.gistid}`,
  };
}

export default async function GistDetailPage({ params }: PageProps) {
  const { gistid } = params;

  let gistData: GitHubGist | null = null;
  let comments: GistComment[] = [];

  // Fetch gist details
  try {
    const { data } = await axios.get(`https://api.github.com/gists/${gistid}`);
    gistData = data;
  } catch (err) {
    console.error("Error fetching gist:", err);
    redirect("/not-found");
  }

  if (!gistData) {
    redirect("/not-found");
  }

  // Fetch comments
  try {
    const { data } = await axios.get<GistComment[]>(`https://api.github.com/gists/${gistid}/comments`);
    comments = data;
  } catch (err) {
    console.error("Error fetching comments:", err);
  }

  const fileKeys = Object.keys(gistData.files);
  if (fileKeys.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">No files found in this gist.</h1>
      </div>
    );
  }

  const fileKey = fileKeys[0];
  const file = gistData.files[fileKey];
  const contentRes = await fetch(file.raw_url);
  const content = await contentRes.text();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* User Info */}
      <div className="flex items-center gap-4">
        <Image
          src={gistData.owner.avatar_url}
          alt={gistData.owner.login}
          width={50}
          height={50}
          className="rounded-full border"
        />
        <div>
          <h2 className="text-lg font-semibold">
            <Link
              href={`/user-gists/${gistData.owner.login}`}
              className="hover:underline text-blue-600"
            >
              @{gistData.owner.login}
            </Link>
          </h2>
          <a
            href={gistData.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            View Gist on GitHub →
          </a>
        </div>
      </div>

      {/* File Name */}
      <h1 className="text-2xl font-bold">{file.filename}</h1>

      {/* Description */}
      <p className="text-gray-600">
        {gistData.description ?? <span className="italic">No description</span>}
      </p>

      {/* Syntax Highlighted Code */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <SyntaxHighlighter
          language="text"
          style={oneLight}
          customStyle={{
            margin: 0,
            padding: "1rem",
            maxHeight: "500px",
            overflow: "auto",
            fontSize: "0.9rem",
            lineHeight: "1.4",
          }}
        >
          {content}
        </SyntaxHighlighter>
      </div>

      {/* Comment Form */}
      <CommentForm gistId={gistData.id} />

      {/* Comments */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-gray-200 rounded p-3 bg-gray-50"
            >
              <div className="flex items-center gap-2 mb-1">
                <Image
                  src={comment.user.avatar_url}
                  alt={comment.user.login}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-semibold">{comment.user.login}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm">{comment.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
