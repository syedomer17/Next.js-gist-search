import axios from "axios";

export async function getUserGists(token: string) {
  const res = await axios.get("https://api.github.com/gists", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getPublicGistsByUsername(username: string) {
  const res = await axios.get(`https://api.github.com/users/${username}/gists`);
  return res.data;
}