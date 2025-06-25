'use client';

import dynamic from 'next/dynamic';
import { GitHubUser, GitHubGist } from '@/types/github';

// Dynamically import the client-side component
const GistUserClient = dynamic(() => import('./GistUserClient'), { ssr: false });

interface Props {
  userData: GitHubUser | null;
  gists: GitHubGist[];
  username: string;
}

export default function GistUserClientWrapper({ userData, gists, username }: Props) {
  // Ensure each file has raw_url to satisfy prop types
  const patchedGists: GitHubGist[] = gists.map(gist => ({
    ...gist,
    files: Object.fromEntries(
      Object.entries(gist.files).map(([key, file]) => [
        key,
        {
          ...file,
          raw_url: file.raw_url ?? '', // fallback to empty string
        },
      ])
    ),
  }));

  return <GistUserClient userData={userData} gists={patchedGists} username={username} />;
}
