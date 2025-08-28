// src/components/PrivateRoute.tsx
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export const PrivateRoute: React.FC<{ children: JSX.Element; roles?: string[] }> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role || "USER")) return <Navigate to="/" replace />;
  return children;
};
