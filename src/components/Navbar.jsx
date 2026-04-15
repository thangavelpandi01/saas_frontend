import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice";
import { logoutUser } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mode = useSelector((state) => state.theme.mode);
  const token = useSelector((state) => state.auth.token);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ NEW: Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser(token));
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`w-full shadow-lg transition-all duration-300 ${
          mode === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

          {/* BRAND */}
          <div
            className="text-xl font-bold tracking-wide cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            SaaS App
          </div>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex gap-8 font-medium">

            <Link className="hover:text-gray-200 transition" to="/dashboard">
              Dashboard
            </Link>

            <Link className="hover:text-gray-200 transition" to="/plans">
              Plans
            </Link>

            <Link className="hover:text-gray-200 transition" to="/MyPlan">
              Active Plans
            </Link>

          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center gap-3 md:gap-4">

            {/* THEME */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
            >
              {mode === "light" ? "🌙" : "☀️"}
            </button>

            {/* LOGOUT (HIDE IN MOBILE MENU) */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="hidden md:block px-4 py-2 text-sm font-semibold rounded-full
                         bg-red-500 hover:bg-red-600
                         active:scale-95 transition-all duration-200 shadow-md"
            >
              Logout
            </button>

            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl"
            >
              ☰
            </button>

          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {menuOpen && (
          <div
            className={`md:hidden px-4 pb-4 space-y-3 ${
              mode === "dark" ? "bg-gray-900" : "bg-blue-700"
            }`}
          >
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block py-2 border-b border-white/20"
            >
              Dashboard
            </Link>

            <Link
              to="/plans"
              onClick={() => setMenuOpen(false)}
              className="block py-2 border-b border-white/20"
            >
              Plans
            </Link>

            <Link
              to="/MyPlan"
              onClick={() => setMenuOpen(false)}
              className="block py-2 border-b border-white/20"
            >
              Active Plans
            </Link>

            {/* MOBILE LOGOUT */}
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full text-left py-2 text-red-300"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* ================= MODAL ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 animate-fadeIn">

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-2xl">
                ⚠️
              </div>
            </div>

            <h2 className="text-xl font-bold text-center text-gray-800">
              Confirm Logout
            </h2>

            <p className="text-center text-gray-500 mt-2">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-4 mt-6">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md active:scale-95 transition"
              >
                Yes, Logout
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `}
      </style>
    </>
  );
}
