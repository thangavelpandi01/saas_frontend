import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../page/Login";
import Dashboard from "../page/Dashboard";
import PlansPage from "../page/Plans";
import MyPlan from "../page/My-subscribtion";
import Register from "../page/Register";

import RoleRedirect from "./RoleRedirect";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./Adminroute";
import Layout from "../layout/Layout"; // ✅ ADD

// Admin pages
import AdminDashboard from "../adminpanel/AdminDashboard";
import Users from "../adminpanel/Users";
import Plans from "../adminpanel/Plans";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT */}
        <Route path="/" element={<RoleRedirect />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />


        {/* 🔥 LAYOUT WRAPPER */}
        <Route element={<Layout />}>

          {/* USER ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/plans"
            element={
              <ProtectedRoute>
                <PlansPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Myplan"
            element={
              <ProtectedRoute>
                <MyPlan />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/plans"
            element={
              <AdminRoute>
                <Plans />
              </AdminRoute>
            }
          />

        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<RoleRedirect />} />

      </Routes>
    </BrowserRouter>
  );
}