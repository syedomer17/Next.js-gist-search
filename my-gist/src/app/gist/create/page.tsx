'use client';
import {useState} from "react";
import { useSessionUser } from "@/hooks/useSessionUser";
import {useRouter} from "next/navigation";

export default function CreateGist() {
  const { accessToken } = useSessionUser();
  const [desc, setDesc] = useState("");
  const [filename, setName] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const router = useRouter();

  const handleSubmit = async(e:any)=>{
    e.preventDefault();
    const res = await fetch("https://api.github.com/gists", {
      method:"POST",
      headers:{
        "Authorization":`Bearer ${accessToken}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({description:desc, public:isPublic, files:{[filename]:{content}}})
    });
    const data = await res.json();
    router.push(`/gist/${data.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h1>Create Gist</h1>
      <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="..." />
      <input value={filename} onChange={e=>setName(e.target.value)} placeholder="filename.ext" className="..." />
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="File content" className="..." />
      <label><input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)}/> Public</label>
      <button type="submit" className="bg-green-600 ...">Create</button>
    </form>
  );
}
