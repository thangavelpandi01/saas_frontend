import { Navigate } from "react-router-dom";

export default function RoleRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  return user.role === "admin"
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/dashboard" />;
}