import React from "react";
import { Link } from "@tanstack/react-router";
import { useAuth, useAuthForm } from "../../hooks";
import { registerFormSchema } from "./register-form-types";

export const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();

  const {
    register,
    formState: { errors },
    loading,
    error,
    success,
    onSubmit,
  } = useAuthForm({
    schema: registerFormSchema,
    onSubmit: async ({ email, password }) => registerUser({ email, password }),
    redirectDelay: 2000,
  });

  if (success) {
    return (
      <div className="h-full flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="card-title text-2xl font-bold justify-center mb-4">
              Welcome to Pokédex!
            </h2>
            <p className="text-base-content/70 mb-6">
              Your account has been created successfully. Please check your
              email to verify your account.
            </p>
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-md"></span>
            </div>
            <p className="text-sm text-base-content/50 mt-2">
              Redirecting you to the app...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center justify-center mb-6">
            Join the Pokédex
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email")}
                disabled={loading}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {typeof errors.email === "string"
                      ? errors.email
                      : errors.email.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Create a password (min. 6 characters)"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password")}
                disabled={loading}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {typeof errors.password === "string"
                      ? errors.password
                      : errors.password.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className={`input input-bordered w-full ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                {...register("confirmPassword")}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {typeof errors.confirmPassword === "string"
                      ? errors.confirmPassword
                      : errors.confirmPassword.message}
                  </span>
                </label>
              )}
            </div>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <div className="text-center">
            <p className="text-sm text-base-content/70">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
