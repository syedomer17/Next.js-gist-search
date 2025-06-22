"use client";
import { useState } from "react";
import { getPublicGistsByUsername } from "@/lib/github";

export default function Search() {
  const [username, setUsername] = useState("");
  const [gists, setGists] = useState([]);

  const handleSearch = async () => {
    console.log("handleSearch triggered with username:", username);
    if (!username.trim()) return;
    const data = await getPublicGistsByUsername(username);
    setGists(data);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("Key pressed:", e.key);
    if (e.key === "enter") {
      e.preventDefault(); // prevent form submission or default behavior
      handleSearch();
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Enter GitHub username"
        className="p-2 border rounded-md mr-2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Search
      </button>

      <div className="mt-4">
        {gists.map((gist: any) => (
          <div key={gist.id} className="p-4 border mb-2 rounded-md">
            <h2 className="font-bold">{gist.description || "No description"}</h2>
            <a
              href={gist.html_url}
              className="text-blue-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              View Gist
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
