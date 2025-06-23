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
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {userData && (
        <div className="flex items-center gap-4 mb-4 bg-white shadow-sm p-4 rounded-lg">
          <img
            src={userData.avatar_url}
            alt={`${userData.login}'s avatar`}
            className="w-16 h-16 rounded-full border"
          />
          <div>
            <h1 className="text-2xl font-bold">{userData.name || userData.login}</h1>
            <p className="text-gray-600 text-sm">@{userData.login}</p>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold">{params.username}'s Public Gists</h2>

      {gists.length === 0 ? (
        <p className="text-gray-500">No public gists found.</p>
      ) : (
        <div className="space-y-3">
          {gists.map((g: any) => (
            <a
              key={g.id}
              href={g.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border rounded-lg p-4 bg-white shadow-sm hover:bg-gray-50 transition-transform hover:scale-[1.01] cursor-pointer"
            >
              <h3 className="font-medium text-gray-800">
                {g.description || <span className="italic text-gray-500">No description</span>}
              </h3>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
