import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import React from 'react'

export default function CheckingAuthRoutes() {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth.user ? <Navigate to="/" state={{ from: location }} replace /> : <Outlet />
    )
}
