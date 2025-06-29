// src/app/user-gists/[username]/gists/[gistid]/page.tsx

import axios from "axios";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Gist ${params.gistid}`,
  };
}

export default async function GistDetailPage({ params }: PageProps) {
  const { gistid } = params;

  let gistData: GitHubGist | null = null;

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
      <div className="border border-gray-200 dark:border-neutral-700 rounded overflow-hidden">
        <SyntaxHighlighter
          language="text" // You could also guess language or use "javascript" as default
          style={oneLight}
          customStyle={{
            margin: 0,
            padding: "1rem",
            maxHeight: "500px",
            overflow: "auto",
            fontSize: "0.9rem",
            lineHeight: "1.4",
            background: "var(--tw-bg-neutral-100)",
          }}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
