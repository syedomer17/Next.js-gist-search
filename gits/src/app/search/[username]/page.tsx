import Image from "next/image";
import Link from "next/link";

interface Gist {
  id: string;
  html_url: string;
  description: string;
  files: Record<string, any>;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

async function getUserGists(username: string): Promise<Gist[] | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/gists`, {
      headers: { Accept: "application/vnd.github+json" },
      // cache: 'no-store' // optionally disable cache for fresh data
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export default async function UserGistPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;  // Await here, important for Next.js 15
  const gists = await getUserGists(username);

  if (!gists) {
    return (
      <div className="p-6 text-center text-red-600">
        User not found
        <div className="mt-4">
          <Link href="/search" className="text-blue-600 underline">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  if (gists.length === 0) {
    return (
      <div className="p-6 text-center text-yellow-500">
        😕 No public gists found for <strong>{username}</strong>.
        <div className="mt-4">
          <Link href="/search" className="text-blue-600 underline">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const user = gists[0].owner;
  const pageSize = 5;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={user.avatar_url}
          alt="Avatar"
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.login}</h1>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View GitHub Profile
          </a>
        </div>
      </div>

      <ul className="space-y-4">
        {gists.slice(0, pageSize).map((gist) => (
          <li key={gist.id} className="p-4 border rounded-md">
            <h2 className="font-semibold">
              {gist.description || "No description"}
            </h2>
            <p className="text-sm text-gray-500 mb-1">
              Files: {Object.keys(gist.files).join(", ")}
            </p>
            <a
              href={gist.html_url}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              View Gist →
            </a>
          </li>
        ))}
      </ul>

      {gists.length > pageSize && (
        <p className="mt-4 text-gray-600">
          Showing first {pageSize} of {gists.length} gists. (Pagination can be
          added with query params.)
        </p>
      )}

      <div className="mt-6">
        <Link
          href="/"
          className="inline-block text-sm text-blue-600 underline"
        >
          ← Back to Search
        </Link>
      </div>
    </div>
  );
}