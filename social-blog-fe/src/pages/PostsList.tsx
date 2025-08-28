// src/pages/PostsList.tsx
import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function PostsList() {
  const [posts, setPosts] = useState<any[]>([]);
  const fetch = async () => {
    const res = await API.get("/posts");
    setPosts(res.data);
  };
  useEffect(() => { fetch(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete?")) return;
    await API.delete(`/posts/${id}`);
    fetch();
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl mb-4">Posts</h2>
      <div className="grid gap-4">
        {posts.map(p => (
          <div key={p.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-bold">{p.title}</h3>
            <p className="text-sm">{p.content}</p>
            {p.imagePath && <img src={p.imagePath} alt="" className="w-48 mt-2" />}
            <div className="mt-2 flex gap-2">
              <Link to={`/posts/${p.id}/edit`} className="text-blue-500">Edit</Link>
              <button className="text-red-500" onClick={() => remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
