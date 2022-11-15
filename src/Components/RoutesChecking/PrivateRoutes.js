import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import React from 'react'

export default function PrivateRoutes() {
    const { auth } = useAuth();
    const location = useLocation();
    return (
        auth.user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
    )
}
