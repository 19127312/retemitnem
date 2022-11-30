import { useLocation, Navigate, Outlet } from "react-router-dom";
import React from "react";
import useAuth from "../../Hooks/useAuth";

export default function PrivateRoutes() {
  const { auth } = useAuth();
  const location = useLocation();
  localStorage.setItem("from", location.pathname);
  return auth?.user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
