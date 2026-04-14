import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute({ children }) {

  const reduxUser = useSelector((state) => state.auth.user);

  const localUser = JSON.parse(localStorage.getItem("user"));

  const user = reduxUser || localUser;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}