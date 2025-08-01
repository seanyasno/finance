import React from "react";
import { isNotNullOrUndefined } from "@poke-playbook/libs";
import { Navigate } from "@tanstack/react-router";
import { ErrorBoundarySuspense } from "@/components";
import { LoginForm } from "../components";
import { useAuth } from "../hooks";

export const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isNotNullOrUndefined(user)) {
    return <Navigate to="/" />;
  }

  return (
    <ErrorBoundarySuspense>
      <LoginForm />
    </ErrorBoundarySuspense>
  );
};
