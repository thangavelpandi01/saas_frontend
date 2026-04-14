import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerThunk } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // ✅ SUBMIT FUNCTION
  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    console.log("REGISTER PAYLOAD:", payload);

    try {
      await dispatch(registerThunk(payload)).unwrap();
      toast.success("Registered Successfully");
    
      navigate("/login"); // go to login
    } catch (err) {
      toast.error(err?.message || "Register Failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] px-4">
      
      <div className="w-full max-w-md p-8 
        bg-white/10 dark:bg-white/5 
        border border-white/20 
        rounded-2xl shadow-2xl 
        backdrop-blur-xl">

        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Create Account ✨
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Name */}
          <div className="relative mb-6">
            <input
              {...register("name", { required: "Name is required" })}
              className="peer w-full p-3 pt-5 rounded-lg border border-white/30 bg-white/10 text-white outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="absolute left-3 top-3 text-gray-300 text-sm transition-all 
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-300
              peer-valid:top-1 peer-valid:text-xs peer-valid:text-blue-300">
              Name
            </label>
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
              className="peer w-full p-3 pt-5 rounded-lg border border-white/30 bg-white/10 text-white outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="absolute left-3 top-3 text-gray-300 text-sm transition-all 
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-300
              peer-valid:top-1 peer-valid:text-xs peer-valid:text-blue-300">
              Email
            </label>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
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
              className="peer w-full p-3 pt-5 rounded-lg border border-white/30 bg-white/10 text-white outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            />
            <label className="absolute left-3 top-3 text-gray-300 text-sm transition-all 
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-300
              peer-valid:top-1 peer-valid:text-xs peer-valid:text-blue-300">
              Password
            </label>

            {/* Toggle */}
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

          {/* Confirm Password */}
          <div className="relative mb-6">
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="peer w-full p-3 pt-5 rounded-lg border border-white/30 bg-white/10 text-white outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="absolute left-3 top-3 text-gray-300 text-sm transition-all 
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-300
              peer-valid:top-1 peer-valid:text-xs peer-valid:text-blue-300">
              Confirm Password
            </label>

            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>

        {/* Bottom */}
        <p className="text-center text-sm text-gray-300 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-300 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}