type PageProps = {
  params: {
    username: string;
  };
};

export async function generateMetadata({ params }: PageProps) {
  const { username } = await Promise.resolve(params);
  return { title: `${username}'s gists` };
}

export default async function GistUserPage({ params }: PageProps) {
  // Fetch user profile data (avatar, name)
  const userRes = await fetch(`https://api.github.com/users/${params.username}`, {
    next: { revalidate: 60 },
  });

  const userData = userRes.ok ? await userRes.json() : null;

  // Fetch public gists
  const gistsRes = await fetch(`https://api.github.com/users/${params.username}/gists`, {
    next: { revalidate: 60 },
  });

  const gists = gistsRes.ok ? await gistsRes.json() : [];

  return (
    <div className="p-6 space-y-6">
      {userData && (
        <div className="flex items-center gap-4 mb-4">
          <img
            src={userData.avatar_url}
            alt={`${userData.login}'s avatar`}
            className="w-16 h-16 rounded-full border"
          />
          <div>
            <h1 className="text-xl font-bold">{userData.name || userData.login}</h1>
            <p className="text-gray-600">@{userData.login}</p>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold">{params.username}'s Public Gists</h2>

      {gists.length === 0 ? (
        <p className="text-gray-500">No public gists found.</p>
      ) : (
        gists.map((g: any) => (
          <a
            key={g.id}
            href={g.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border p-4 rounded mb-2 hover:bg-gray-50"
          >
            <h3 className="font-semibold">{g.description || "No description"}</h3>
          </a>
        ))
      )}
    </div>
  );
}
