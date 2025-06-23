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

        // Extract the content from the first file
        const firstFileKey = Object.keys(data.files)[0];
        const file = data.files[firstFileKey];

        // If `content` is not available in response, fetch raw URL
        if (file.content) {
          setContent(file.content);
        } else if (file.raw_url) {
          fetch(file.raw_url)
            .then((res) => res.text())
            .then(setContent);
        }
      });
  }, [accessToken, params.gistid]);

  if (!gist) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">{gist.description || 'No description'}</h1>

      <h2 className="text-lg font-semibold">File: {Object.keys(gist.files)[0]}</h2>

      <pre className="bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap">
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
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
        <button
          onClick={() => router.push(`/gist/${params.gistid}/edit`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
