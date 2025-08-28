// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/");
    } catch (err) { alert("Login failed"); }
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const googleUrl = `${API_URL}/auth/google`; // backend should initiate oauth and then redirect to frontend callback

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn w-full" type="submit">Login</button>
      </form>

      <div className="mt-4 text-center">
        <a href={googleUrl} className="inline-block bg-red-500 text-white px-4 py-2 rounded">Login with Google</a>
      </div>
    </div>
  );
}
