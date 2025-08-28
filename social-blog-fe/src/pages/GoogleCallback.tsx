// src/pages/GoogleCallback.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const nav = useNavigate();
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const access = qs.get("accessToken");
    const refresh = qs.get("refreshToken");
    if (access) localStorage.setItem("accessToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);
    nav("/");
  }, []);
  return <div className="mt-20 text-center">Logging you in…</div>;
}
