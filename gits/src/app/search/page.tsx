"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const router = useRouter();

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [username]);

  const handleSearch = () => {
    if (debouncedUsername.trim()) {
      router.push(`/search/${debouncedUsername.trim()}`);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🔍 GitHub Gist Search</h1>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-grow border p-3 rounded-md shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>
    </div>
  );
}