import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangePasswordSchema } from "../../Utility/ValidationSchema/Validation";
import { updatePassword } from "../../Thunks/Thunks";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/Slices/Slice";

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ChangePasswordSchema),
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const btnLoader = useSelector(
    (state) => state.apiStatus?.loading?.updatePassword
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Replace with your API call to update the password
    dispatch(updatePassword({ data, buttonKey: "updatePassword" }))
      .unwrap()
      .then(() => {
        dispatch(logout());
        alert(
          "Your password has been updated successfully. Please login again."
        );
        navigate("/login");
      });
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-neutral-800">
          Change Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Current Password*
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
                aria-label={
                  showPassword
                    ? "Hide current password"
                    : "Show current password"
                }
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
              htmlFor="new_password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              New Password*
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new_password"
                {...register("new_password")}
                placeholder="••••••••"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.new_password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-red-600"
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
              >
                <i
                  className={
                    showNewPassword ? "fas fa-eye-slash" : "fas fa-eye"
                  }
                ></i>
              </button>
            </div>
            {errors.new_password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.new_password.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Confirm New Password*
            </label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                id="confirm_password"
                {...register("confirm_password")}
                placeholder="••••••••"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.confirm_password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-red-600"
                aria-label={
                  showConfirmNewPassword
                    ? "Hide confirm new password"
                    : "Show confirm new password"
                }
              >
                <i
                  className={
                    showConfirmNewPassword ? "fas fa-eye-slash" : "fas fa-eye"
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
            Update Password
          </button>
        </form>
        <p className="text-sm mt-6 text-center text-neutral-600">
          <Link to="/profile" className="text-red-600 hover:underline">
            Back to Profile
          </Link>
        </p>
      </div>
    </main>
  );
}
