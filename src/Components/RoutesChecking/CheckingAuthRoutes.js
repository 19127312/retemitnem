import { useLocation, Navigate, Outlet } from "react-router-dom";
import React from "react";
import useAuth from "../../Hooks/useAuth";

export default function CheckingAuthRoutes() {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.user ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
}
