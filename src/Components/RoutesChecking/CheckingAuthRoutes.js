import { useLocation, Navigate, Outlet } from "react-router-dom";
import React from "react";
import useAuth from "../../Hooks/useAuth";

export default function CheckingAuthRoutes() {
  const { auth } = useAuth();
  const location = useLocation();
  const from = localStorage.getItem("from");

  return auth?.user && from ? (
    <Navigate to={from} state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
}
