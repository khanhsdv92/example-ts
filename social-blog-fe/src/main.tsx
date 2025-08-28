// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./auth/AuthProvider";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostsList from "./pages/PostsList";
import PostForm from "./pages/PostForm";
import GoogleCallback from "./pages/GoogleCallback";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/google-callback" element={<GoogleCallback />} />
          <Route path="/posts" element={<PostsList />} />
          <Route path="/posts/new" element={<PostForm />} />
          <Route path="/posts/:id/edit" element={<PostForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
