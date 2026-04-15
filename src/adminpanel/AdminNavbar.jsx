import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice";
import { logoutUser } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ FIX

  const mode = useSelector((state) => state.theme.mode);
  const token = useSelector((state) => state.auth.token);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser(token));
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`w-full shadow-lg ${
          mode === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* BRAND */}
          <div
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate("/admin/dashboard")}
          >
            Admin Panel
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-8 font-medium">
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/plans">Plans</Link>
            <Link to="/admin/users">Users</Link>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">

            {/* THEME */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
            >
              {mode === "light" ? "🌙" : "☀️"}
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden text-2xl"
            >
              ☰
            </button>

            {/* LOGOUT */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="hidden md:block bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div
            className={`md:hidden flex flex-col gap-4 px-6 py-4 ${
              mode === "dark" ? "bg-gray-800" : "bg-blue-600"
            }`}
          >
            <Link to="/admin/dashboard" onClick={() => setMobileMenu(false)}>
              Dashboard
            </Link>
            <Link to="/admin/plans" onClick={() => setMobileMenu(false)}>
              Plans
            </Link>
            <Link to="/admin/users" onClick={() => setMobileMenu(false)}>
              Users
            </Link>

            <button
              onClick={() => {
                setMobileMenu(false);
                setShowLogoutModal(true);
              }}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* MODAL */}
          <div
            className={`relative p-6 rounded-xl w-[90%] max-w-sm ${
              mode === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            }`}
          >
            <h2 className="text-lg font-bold text-center mb-2">
              Confirm Logout
            </h2>

            <p className="text-center text-sm mb-4">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
