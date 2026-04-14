import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector, useDispatch } from "react-redux";
import { dashboardThunk } from "../features/authSlice"; // ✅ adjust path if needed

const DashboardChart = () => {
  const dispatch = useDispatch();

  // ✅ FIX: correct state path
  const { dashboard, loading } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const isDark = mode === "dark";

  // ✅ API CALL
  useEffect(() => {
    dispatch(dashboardThunk());
  }, [dispatch]);

  // ✅ SAFE DATA EXTRACTION
  const months =
    dashboard?.last12Months?.map((item) => item.month) || [];

  const subscriptions =
    dashboard?.last12Months?.map(
      (item) => item.totalSubscriptions
    ) || [];

  const totalRevenue = dashboard?.summary?.totalRevenue || 0;
  const totalSubscriptions =
    dashboard?.summary?.totalSubscriptions || 0;

  const lastMonthValue =
    subscriptions[subscriptions.length - 1] || 0;

  // ✅ CHART CONFIG
  const chartData = {
    series: [
      {
        name: "Subscriptions",
        type: "column",
        data: subscriptions,
      },
      {
        name: "Total Investment",
        type: "line",
        data: subscriptions.map((val) => val * 999), // demo logic
      },
    ],

    options: {
      chart: {
        height: 350,
        type: "line",
        toolbar: { show: false },
        background: "transparent",
        foreColor: isDark ? "#E5E7EB" : "#111827",
      },

      theme: {
        mode: isDark ? "dark" : "light",
      },

      colors: ["#3B82F6", "#10B981"],

      stroke: {
        width: [0, 3],
        curve: "smooth",
      },

      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },

      labels: months,

      xaxis: {
        labels: {
          style: {
            colors: isDark ? "#9CA3AF" : "#6B7280",
          },
        },
      },

      yaxis: [
        {
          title: {
            text: "Subscriptions",
            style: {
              color: isDark ? "#9CA3AF" : "#6B7280",
            },
          },
        },
        {
          opposite: true,
          title: {
            text: "Total Investment",
            style: {
              color: isDark ? "#9CA3AF" : "#6B7280",
            },
          },
        },
      ],

      grid: {
        borderColor: isDark ? "#374151" : "#E5E7EB",
      },

      tooltip: {
        theme: isDark ? "dark" : "light",
      },

      legend: {
        labels: {
          colors: isDark ? "#E5E7EB" : "#111827",
        },
      },
    },
  };

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-300 ${
        isDark
          ? "bg-gray-900 text-white mt-5"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Dashboard Overview
        </h1>
        <p
          className={
            isDark ? "text-gray-400" : "text-gray-500"
          }
        >
          Monitor your subscription performance
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT CARDS */}
          <div className="lg:col-span-1 space-y-6">

            <div
              className={`p-5 rounded-xl border ${
                isDark
                  ? "bg-white/10 border-white/10"
                  : "bg-white"
              }`}
            >
              <p>Total Subscriptions</p>
              <h2 className="text-3xl font-bold text-blue-500">
                {totalSubscriptions}
              </h2>
            </div>

            <div
              className={`p-5 rounded-xl border ${
                isDark
                  ? "bg-white/10 border-white/10"
                  : "bg-white"
              }`}
            >
              <p>Total Investment</p>
              <h2 className="text-3xl font-bold text-green-500">
                ₹{totalRevenue}
              </h2>
            </div>

            <div
              className={`p-5 rounded-xl border ${
                isDark
                  ? "bg-white/10 border-white/10"
                  : "bg-white"
              }`}
            >
              <p>Last Month Subscriptions</p>
              <h2 className="text-3xl font-bold text-yellow-500">
                {lastMonthValue}
              </h2>
            </div>

          </div>

          {/* RIGHT CHART */}
          <div
            className={`lg:col-span-2 p-6 rounded-xl border ${
              isDark
                ? "bg-white/10 border-white/10"
                : "bg-white"
            }`}
          >
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

export default DashboardChart;