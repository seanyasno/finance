import React from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/features";
import { isNotNullOrUndefined } from "@poke-playbook/libs";

export const AppBar: React.FC = () => {
  const { user, logout, loading } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <div className="border-b border-base-300 bg-base-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-medium text-base-content">
              Poké Playbook
            </Link>

            {isNotNullOrUndefined(user) && (
              <nav className="hidden md:flex gap-6">
                <Link
                  to="/"
                  className="text-sm text-base-content/60 hover:text-base-content transition-colors"
                  activeProps={{ className: "text-base-content font-medium" }}
                >
                  Pokédex
                </Link>
                <Link
                  to="/teams"
                  className="text-sm text-base-content/60 hover:text-base-content transition-colors"
                  activeProps={{ className: "text-base-content font-medium" }}
                >
                  Teams
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : isNotNullOrUndefined(user) ? (
              <>
                <div
                  className="text-sm text-base-content/50 hidden sm:block"
                  data-testid="user-menu"
                >
                  {user?.email || "User"}
                </div>
                <button
                  className="text-sm text-base-content/60 hover:text-base-content transition-colors px-3 py-2"
                  data-testid="logout-button"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm text-base-content/60 hover:text-base-content transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
