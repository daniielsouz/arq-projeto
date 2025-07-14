import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Se não estiver logado, redireciona para /login
    return <Navigate to="/login" replace />;
  }

  // Se tiver token, renderiza o conteúdo
  return children;
}
