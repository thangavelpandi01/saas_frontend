import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import AdminNavbar from "../adminpanel/AdminNavbar";
import { useEffect } from "react";

export default function Layout() {
  const token = useSelector((state) => state.auth.token);
  const reduxUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // fallback localStorage
  const user = reduxUser || JSON.parse(localStorage.getItem("user"));

  // ✅ FIXED POSITION
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      {/* ✅ ROLE BASED NAVBAR */}
      {token && user?.role === "user" && <Navbar />}
      {token && user?.role === "admin" && <AdminNavbar />}

      <Outlet />
    </>
  );
}