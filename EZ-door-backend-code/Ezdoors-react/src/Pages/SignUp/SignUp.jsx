import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupSchema } from "../../Utility/ValidationSchema/Validation";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../Thunks/Thunks";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const btnLoader = useSelector((state) => state.apiStatus?.loading?.signup);
  console.log("btnLoader", btnLoader);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    // Replace with your API call or submission logic
    await dispatch(signup({ data, buttonKey: "signup" })).unwrap();
    navigate("/login");
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-neutral-800">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Full Name*
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              placeholder="John Doe"
              className={`w-full px-4 py-2 rounded-md border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Email*
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="you@example.com"
              className={`w-full px-4 py-2 rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Phone Number*
            </label>
            <input
              type="tel"
              id="phone"
              {...register("phone")}
              placeholder="+1234567890"
              className={`w-full px-4 py-2 rounded-md border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                placeholder="••••••••"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-red-600"
              >
                <i
                  className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                ></i>
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Confirm Password*
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                {...register("confirm_password")}
                placeholder="••••••••"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.confirm_password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-red-600"
              >
                <i
                  className={
                    showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"
                  }
                ></i>
              </button>
            </div>
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirm_password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 
    ${
      btnLoader
        ? "bg-red-400 text-white cursor-not-allowed opacity-60"
        : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
    }`}
            disabled={btnLoader}
          >
            {btnLoader && <i className="fas fa-spinner fa-spin mr-2"></i>}
            Sign Up
          </button>
        </form>
        <p className="text-sm mt-6 text-center text-neutral-600">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
