// src/app/user-gists/[username]/page.tsx

import axios from 'axios';
import GistUserClient from '@/component/GistUserClient';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

interface PageProps {
  params: { username: string };
}

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
}

interface GitHubGist {
  id: string;
  html_url: string;
  description: string | null;
  files: {
    [key: string]: {
      filename: string;
      raw_url: string;
    };
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `${params.username}'s Gists`,
  };
}

export default async function GistUserPage({ params }: PageProps) {
  const username = params.username;
  let userData: GitHubUser | null = null;
  let gists: GitHubGist[] = [];

  try {
    const [userRes, gistRes] = await Promise.all([
      axios.get<GitHubUser>(`https://api.github.com/users/${username}`),
      axios.get<GitHubGist[]>(`https://api.github.com/users/${username}/gists`)
    ]);

    userData = userRes.data;
    gists = gistRes.data;
  } catch (err) {
    console.error('Error fetching GitHub data:', err);
    redirect('/not-found');
  }

  return (
    <GistUserClient
      userData={userData}
      gists={gists}
      username={username}
    />
  );
}
