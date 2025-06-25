'use client';

import dynamic from 'next/dynamic';
import { GitHubUser, GitHubGist } from '@/types/github';

const GistUserClient = dynamic(() => import('./GistUserClient'), { ssr: false });

interface Props {
  userData: GitHubUser | null;
  gists: GitHubGist[];
  username: string;
}

export default function GistUserClientWrapper({ userData, gists, username }: Props) {
  return <GistUserClient userData={userData} gists={gists} username={username} />;
}
