import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../Utility/ValidationSchema/Validation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../Thunks/Thunks";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get location to access state
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const btnLoader = useSelector((state) => state.apiStatus?.loading?.login);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // 🧠 Load saved credentials (if any)
  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("rememberMeData"));
    if (savedCredentials) {
      setValue("email", savedCredentials.email);
      setValue("password", savedCredentials.password);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    if (rememberMe) {
      localStorage.setItem("rememberMeData", JSON.stringify(data));
    } else {
      localStorage.removeItem("rememberMeData");
    }

    try {
      await dispatch(
        login({ data, buttonKey: "login", navigate })
      ).unwrap();
      // Redirect to the page user came from, or default to "/"
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded focus:ring-red-500 focus:outline-none`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded focus:ring-red-500 focus:outline-none pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 focus:outline-none"
              >
                <i
                  className={
                    showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                  }
                ></i>
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link
              to="/forget-password"
              className="text-red-600 hover:underline"
            >
              Forgot password?
            </Link>
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
            {btnLoader && <i className="fas fa-spinner fa-spin mr-2"></i>}
            Login
          </button>
        </form>

        <p className="text-sm mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}