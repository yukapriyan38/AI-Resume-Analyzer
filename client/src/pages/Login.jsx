import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import useAuth from "../hooks/useAuth";

const EyeIcon = ({ visible }) =>
  visible ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A2.5 2.5 0 0 0 13.4 13.4" />
      <path d="M9.1 5.5A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a16.9 16.9 0 0 1-4.1 5.5" />
      <path d="M6.2 6.2A16.6 16.6 0 0 0 2 12s3.5 7 10 7a10.3 10.3 0 0 0 5.8-1.8" />
    </svg>
  );

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto card mt-10">
        <h1 className="text-2xl font-bold mb-6">Log in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input
              type="email"
              className="input-field"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary-600 font-medium">
              Forgot password?
            </Link>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field pr-10"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-600 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </MainLayout>
  );
};

export default Login;
