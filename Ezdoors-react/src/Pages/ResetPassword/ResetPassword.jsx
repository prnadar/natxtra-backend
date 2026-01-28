import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetPasswordSchema } from "../../Utility/ValidationSchema/Validation";
import { useDispatch, useSelector } from "react-redux";
// Assuming a resetPassword thunk exists; replace with your actual thunk
import { resetPassword } from "../../Thunks/Thunks";

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL

  const btnLoader = useSelector(
    (state) => state.apiStatus?.loading?.resetPassword
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    setSuccessMessage("");
    setErrorMessage("");

    const resetData = {
      token, // Include token from URL
      newPassword: data.newPassword,
    };

    try {
      const response = await dispatch(
        resetPassword({ data: resetData, buttonKey: "resetPassword" })
      ).unwrap();
      setSuccessMessage(
        response?.message || "Your password has been successfully reset."
      );
      reset(); // Clear the form
      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setErrorMessage(
        err?.message || "Failed to reset password. Please try again."
      );
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-neutral-800">
          Reset Your Password
        </h2>
        <p className="text-sm text-neutral-600 mb-6 text-center">
          Enter your new password below to reset your account.
        </p>

        {/* Success or Error Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              New Password*
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                {...register("newPassword")}
                placeholder="Enter new password"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 focus:outline-none"
              >
                <i
                  className={
                    showNewPassword ? "fas fa-eye-slash" : "fas fa-eye"
                  }
                ></i>
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Confirm Password*
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Confirm new password"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 focus:outline-none"
              >
                <i
                  className={
                    showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"
                  }
                ></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full block text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors flex items-center justify-center gap-2
            ${
              btnLoader
                ? "bg-red-400 text-white cursor-not-allowed opacity-60"
                : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
            }`}
            disabled={btnLoader}
          >
            {btnLoader && <i className="fas fa-spinner fa-spin"></i>}
            Reset Password
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
