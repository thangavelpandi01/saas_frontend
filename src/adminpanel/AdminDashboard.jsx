import React, { useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector, useDispatch } from "react-redux";
import { dashboardThunk } from "../features/authSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { dashboard, loading } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const isDark = mode === "dark";

  // ✅ LOAD DATA
  useEffect(() => {
    dispatch(dashboardThunk());
  }, [dispatch]);

  // ================= SAFE DATA =================
  const months = useMemo(
    () => dashboard?.last12Months?.map((i) => i.month) || [],
    [dashboard]
  );

  const subscriptions = useMemo(
    () => dashboard?.last12Months?.map((i) => i.totalSubscriptions) || [],
    [dashboard]
  );

  const totalRevenue = dashboard?.summary?.totalRevenue ?? 0;
  const totalSubscriptions = dashboard?.summary?.totalSubscriptions ?? 0;

  const lastMonthValue = subscriptions.at(-1) ?? 0;

  // ================= CHART =================
  const chartData = {
    series: [
      {
        name: "Subscriptions",
        type: "column",
        data: subscriptions,
      },
      {
        name: "Revenue",
        type: "line",
        data: subscriptions.map((v) => v * 999), // replace with real logic if needed
      },
    ],

    options: {
      chart: {
        type: "line",
        height: 350,
        toolbar: { show: false },
        background: "transparent",
      },

      theme: {
        mode: isDark ? "dark" : "light",
      },

      colors: ["#3B82F6", "#10B981"],

      stroke: {
        width: [0, 3],
        curve: "smooth",
      },

      labels: months,

      xaxis: {
        labels: {
          style: {
            colors: isDark ? "#CBD5E1" : "#374151",
          },
        },
      },

      yaxis: [
        {
          title: { text: "Subscriptions" },
        },
        {
          opposite: true,
          title: { text: "Revenue" },
        },
      ],

      grid: {
        borderColor: isDark ? "#374151" : "#E5E7EB",
      },

      tooltip: {
        theme: isDark ? "dark" : "light",
      },
    },
  };

  // ================= UI =================
  return (
    <div
      className={`min-h-screen p-6 transition-all ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm opacity-70">
          Subscription analytics overview
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CARDS */}
          <div className="space-y-4">

            <div className="p-5 rounded-lg bg-white/10 border">
              <p>Total Subscriptions</p>
              <h2 className="text-2xl font-bold text-blue-500">
                {totalSubscriptions}
              </h2>
            </div>

            <div className="p-5 rounded-lg bg-white/10 border">
              <p>Total Revenue</p>
              <h2 className="text-2xl font-bold text-green-500">
                ₹{totalRevenue}
              </h2>
            </div>

            <div className="p-5 rounded-lg bg-white/10 border">
              <p>Last Month</p>
              <h2 className="text-2xl font-bold text-yellow-500">
                {lastMonthValue}
              </h2>
            </div>

          </div>

          {/* CHART */}
          <div className="lg:col-span-2 p-4 rounded-lg bg-white/10 border">
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="line"
              height={350}
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;