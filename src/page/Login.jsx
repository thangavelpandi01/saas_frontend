import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginThunk } from "../features/authSlice";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";


export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
  const payload = {
    email: data.email,
    password: data.password,
  };

  try {
    const res = await dispatch(loginThunk(payload)).unwrap();

    toast.success("Login Successful");

    // ✅ GET ROLE
    const role = res.user.role;

    // ✅ ROLE BASED NAVIGATION
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    toast.error(err?.message || "Login Failed");
  }
};

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] px-4">
        <div className="w-full max-w-md p-8 
          bg-white/10 dark:bg-white/5 
          border border-white/20 
          rounded-2xl shadow-2xl 
          backdrop-blur-xl">

          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* Email */}
            <div className="relative mb-6">
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email",
                  },
                })}
                className="peer w-full p-3 pt-5 rounded-lg 
                border border-white/30 
                focus:ring-2 focus:ring-blue-400 
                outline-none 
                bg-white/10 
                text-white"
              />
              <label className="absolute left-3 top-3 text-gray-300 text-sm transition-all 
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-300
                peer-valid:top-1 peer-valid:text-xs peer-valid:text-blue-300">
                Email
              </label>

              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                className="peer w-full p-3 pt-5 rounded-lg 
                border border-white/30 
                focus:ring-2 focus:ring-blue-400 
                outline-none 
                bg-white/10 
                text-white pr-10"
              />
              <label className="absolute left-3 top-3 text-gray-300 text-sm transition-all 
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-300
                peer-valid:top-1 peer-valid:text-xs peer-valid:text-blue-300">
                Password
              </label>

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-300"
              >
              </span>

              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="flex items-center justify-between mb-4 text-sm">
              <label className="flex items-center gap-2 text-gray-300">
                <input type="checkbox" className="accent-blue-400" />
                Remember me
              </label>

              <span className="text-blue-300 cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow h-px bg-white/20"></div>
            <span className="px-3 text-sm text-gray-300">OR</span>
            <div className="flex-grow h-px bg-white/20"></div>
          </div>

          {/* Register */}
          <p className="text-center text-sm text-gray-300">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-300 font-semibold cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </>
  );
}