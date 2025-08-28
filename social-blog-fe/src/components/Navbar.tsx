// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link to="/" className="font-bold">SocialBlog</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm">Hi, {user.name || user.email} ({user.role})</span>
            <Link to="/posts/new" className="btn">New Post</Link>
            <button className="text-sm" onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/register" className="text-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
