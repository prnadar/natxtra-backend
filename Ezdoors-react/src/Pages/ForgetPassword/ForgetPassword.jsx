import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgetSchema } from "../../Utility/ValidationSchema/Validation";
import { forgetPassword } from "../../Thunks/Thunks";
import { useDispatch, useSelector } from "react-redux";

export default function ForgetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgetSchema),
  });
  const dispatch = useDispatch();
  console.log("location", location);

  const btnLoader = useSelector(
    (state) => state.apiStatus?.loading?.forgetPassword
  );

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    const updateData = {
      ...data,
      url: `${location.origin}/reset-password`,
    };
    // Replace with your API call to send the password reset link
    await dispatch(
      forgetPassword({ data: updateData, buttonKey: "forgetPassword" })
    ).unwrap();
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-neutral-800">
          Forgot Your Password?
        </h2>
        <p className="text-sm text-neutral-600 mb-6 text-center">
          Enter your email and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Email Address*
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
          <button
            type="submit"
            className={`w-full block text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors
            ${
              btnLoader
                ? "bg-red-400 text-white cursor-not-allowed opacity-60"
                : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
            }`}
            disabled={btnLoader}
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-sm mt-6 text-center text-neutral-600">
          Remember your password?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}
