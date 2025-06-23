'use client';
import { useState, useEffect } from "react";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useRouter } from "next/navigation";

export default function EditGist({params}:any) {
  const { accessToken } = useSessionUser();
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [filename, setName] = useState("");
  const router = useRouter();

  useEffect(()=>{
    if(accessToken){
      fetch(`https://api.github.com/gists/${params.gistid}`, {headers:{Authorization:`Bearer ${accessToken}`}})
        .then(r=>r.json()).then(g=>{
          const f = Object.keys(g.files)[0];
          setName(f);
          setContent(g.files[f].content);
          setDesc(g.description||"");
        });
    }
  }, [accessToken]);

  const handleSubmit = async(e:any)=>{
    e.preventDefault();
    await fetch(`https://api.github.com/gists/${params.gistid}`, {
      method:"PATCH",
      headers:{
        "Authorization":`Bearer ${accessToken}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({description:desc, files:{[filename]:{content}}})
    });
    router.push(`/gist/${params.gistid}`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h1>Edit Gist</h1>
      <input value={desc} onChange={e=>setDesc(e.target.value)} className="..." placeholder="Description"/>
      <textarea value={content} onChange={e=>setContent(e.target.value)} className="..." placeholder="Update file content"/>
      <button type="submit" className="bg-blue-600 ...">Save</button>
    </form>
  );
}
