'use client';
import { useEffect, useState } from 'react';
import { useSessionUser } from '@/hooks/useSessionUser';
import { useRouter } from 'next/navigation';

export default function GistDetail({ params }: { params: { gistid: string } }) {
  const { accessToken } = useSessionUser();
  const [gist, setGist] = useState<any>(null);
  const [content, setContent] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) return;

    fetch(`https://api.github.com/gists/${params.gistid}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGist(data);

        const firstFileKey = Object.keys(data.files)[0];
        const file = data.files[firstFileKey];

        if (file.content) {
          setContent(file.content);
        } else if (file.raw_url) {
          fetch(file.raw_url)
            .then((res) => res.text())
            .then(setContent);
        }
      });
  }, [accessToken, params.gistid]);

  if (!gist) return <p className="p-6 text-center text-lg">Loading…</p>;

  const filename = Object.keys(gist.files)[0];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold">
        {gist.description || <span className="italic text-gray-500">No description</span>}
      </h1>

      <h2 className="text-lg font-semibold text-gray-700">File: {filename}</h2>

      <pre className="bg-gray-100 text-sm p-4 rounded-lg overflow-x-auto whitespace-pre-wrap border border-gray-200">
        {content ?? 'Loading file content...'}
      </pre>

      <div className="flex gap-4">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this gist?')) {
              fetch(`https://api.github.com/gists/${params.gistid}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }).then(() => router.push('/my-gists'));
            }
          }}
          className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition-transform transform hover:scale-105 cursor-pointer"
        >
          Delete
        </button>

        <button
          onClick={() => router.push(`/gist/${params.gistid}/edit`)}
          className="bg-yellow-500 text-white px-5 py-2 rounded hover:bg-yellow-600 transition-transform transform hover:scale-105 cursor-pointer"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
