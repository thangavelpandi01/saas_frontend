import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getPlansThunk,
  createOrderThunk,
  verifyPaymentThunk,
  subscribeThunk
} from "../features/authSlice";

import { toast } from "react-toastify";

export default function Plan() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mode } = useSelector((state) => state.theme);
  const { plans, loading } = useSelector((state) => state.auth);

  const [loadingPlanId, setLoadingPlanId] = useState(null);

  useEffect(() => {
    dispatch(getPlansThunk());
  }, [dispatch]);

  // ================= TIMER =================
  const getRemainingTime = (startDate, endDate) => {
    if (!startDate || !endDate) return null;

    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    return `${days}d ${hours}h left`;
  };

  // ================= SUBSCRIBE =================
  const handleSubscribe = async (plan) => {
    if (loadingPlanId) return;

    setLoadingPlanId(plan._id);

    try {
      const result = await dispatch(
        createOrderThunk({
          amount: plan.price,
          planId: plan._id,
        })
      );

      const data = result.payload;

      if (!data?.success || !data?.order) {
        toast.warning("You already subscribed to this plan");
        setLoadingPlanId(null);
        return;
      }

      const options = {
        key: "rzp_test_SctBkYNzzVXH73",
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,

        name: "My SaaS App",
        description: plan.name,

        handler: async function (response) {
          const verifyRes = await dispatch(verifyPaymentThunk(response));

          if (verifyRes.payload?.success) {
            await dispatch(subscribeThunk(plan._id));
            toast.success("Subscription Activated 🎉");
            navigate("/MyPlan");
          } else {
            toast.error("Payment verification failed ❌");
          }

          setLoadingPlanId(null);
        },

        modal: {
          ondismiss: () => setLoadingPlanId(null),
        },

        theme: {
          color: "#3B82F6",
        },
      };

      window.rzp = new window.Razorpay(options);
      window.rzp.open();
    } catch (error) {
      console.error(error);
      setLoadingPlanId(null);
    }
  };

  return (
    <div
      className={`min-h-screen px-8 py-10 transition-all duration-300
      ${
        mode === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-10">
        Our Subscription Plans
      </h1>

      {loading && (
        <p className="text-center">Loading plans...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {plans?.map((plan) => {
          const remaining = getRemainingTime(plan.startDate, plan.endDate);

          return (
            <div
              key={plan._id}
              className={`relative rounded-2xl overflow-hidden shadow-2xl transition
              hover:scale-105 duration-300 border
              ${
                mode === "dark"
                  ? "bg-white/10 border-white/20"
                  : "bg-white border-gray-200"
              }`}
            >

              {/* TIMER */}
              {remaining && (
                <div className="absolute top-3 right-3 px-3 py-1 text-xs font-bold bg-black/70 text-white rounded-full">
                  {remaining}
                </div>
              )}

              {/* DYNAMIC IMAGE */}
              <img
                src={
                  plan.image
                    ? `http://localhost:3000/uploads/${plan.image}`
                    : "https://via.placeholder.com/400"
                }
                className="w-full h-60 object-cover bg-white"
                alt={plan.name}
              />

              {/* CONTENT */}
              <div className="p-5">

                <h2 className="text-lg font-bold">{plan.name}</h2>

                <p className="text-2xl font-bold text-blue-500">
                  ₹{plan.price}
                </p>

                <p className="text-xs opacity-70 mb-3">
                  {plan.duration} Days
                </p>

                <ul className="text-sm space-y-1 mb-4">
                  {plan.features?.map((f, i) => (
                    <li key={i}>✅ {f}</li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlanId === plan._id}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                >
                  {loadingPlanId === plan._id
                    ? "Processing..."
                    : "Subscribe"}
                </button>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}