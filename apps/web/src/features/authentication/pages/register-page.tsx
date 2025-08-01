import { isNotNullOrUndefined } from "@poke-playbook/libs";
import { ErrorBoundarySuspense } from "@/components";
import { Navigate } from "@tanstack/react-router";
import { RegisterForm } from "../components";
import { useAuth } from "../hooks";

export const RegisterPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isNotNullOrUndefined(user)) {
    return <Navigate to="/" />;
  }

  return (
    <ErrorBoundarySuspense>
      <RegisterForm />
    </ErrorBoundarySuspense>
  );
};
