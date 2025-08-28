// src/pages/PostForm.tsx
import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function PostForm() {
  const { id } = useParams();
  const editMode = Boolean(id);
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (editMode) {
      API.get(`/posts/${id}`).then(res => {
        setTitle(res.data.title);
        setContent(res.data.content || "");
        setPreview(res.data.imagePath || null);
      });
    }
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    if (file) fd.append("file", file);

    if (editMode) {
      await API.put(`/posts/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    } else {
      await API.post("/posts", fd, { headers: { "Content-Type": "multipart/form-data" } });
    }
    nav("/");
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">{editMode ? "Edit" : "New"} Post</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <textarea className="input h-24" value={content} onChange={e => setContent(e.target.value)} />
        <input type="file" accept="image/*" onChange={e => {
          const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
        }} />
        {preview && <img src={preview} className="w-40 mt-2" />}
        <button className="btn">{editMode ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}
