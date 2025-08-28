// src/pages/Register.tsx
import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      nav("/");
    } catch (err) { alert("Register failed"); }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn w-full" type="submit">Create account</button>
      </form>
    </div>
  );
}
