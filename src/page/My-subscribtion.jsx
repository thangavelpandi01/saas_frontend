import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyPlansThunk } from "../features/authSlice";

export default function MyPlan() {
  const dispatch = useDispatch();

  const { myPlans = [], loading = false } = useSelector(
    (state) => state.auth
  );

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  useEffect(() => {
    dispatch(getMyPlansThunk());
  }, [dispatch]);

  return (
    <div
      className={`min-h-screen px-8 py-10 transition-all duration-300 ${
        isDark
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] text-white"
      }`}
    >
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-10">
        My Active Subscription
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-300">Loading plans...</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {myPlans?.length > 0 ? (
          myPlans.map((plan, index) => {
            const isActive = plan.status === "active";
            const planData = plan.plan_id || {};

            return (
              <div
                key={plan._id || index}
                className={`relative rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition border ${
                  isDark
                    ? "bg-white/10 border-white/20"
                    : "bg-white/10 border-white/20"
                }`}
              >
                {/* STATUS BADGE */}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full text-white ${
                    isActive ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {isActive ? "Active" : "Expired"}
                </span>

                {/* IMAGE (dynamic fallback) */}
                <img
                  src={
                    planData.image
                      ? `http://localhost:3000/uploads/${planData.image}`
                      : "https://source.unsplash.com/400x200/?subscription,tech"
                  }
                  alt={planData.name}
                  className="w-full h-40 object-cover"
                />

                {/* CONTENT */}
                <div className="p-5">
                  <h2 className="text-lg font-bold">
                    {planData.name || "Plan"}
                  </h2>

                  <p className="text-2xl font-bold text-blue-300">
                    ₹{planData.price || 0}
                  </p>

                  <p className="text-xs text-gray-300 mb-3">
                    {planData.duration || 0} Days
                  </p>

                  <ul className="space-y-1 text-sm">
                    {planData.features?.map((f, i) => (
                      <li key={i}>✅ {f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-3 text-gray-300">
            No plans found
          </p>
        )}
      </div>
    </div>
  );
}