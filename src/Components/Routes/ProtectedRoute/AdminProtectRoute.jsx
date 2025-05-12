import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = ({ element: Element }) => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser?.role.toLowerCase() === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin-login" />
  );
};

export default AdminProtectedRoute;
