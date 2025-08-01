/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock for authentication hooks
import React from "react";

let mockFormState = {
  loading: false,
  error: null,
  success: false,
  errors: {},
};

export const useAuth = () => ({
  login: async ({ email, password }: any) => {
    console.log("Login called with:", { email, password });
    return { user: { email } };
  },
  register: async ({ email, password }: any) => {
    console.log("Register called with:", { email, password });
    return { user: { email } };
  },
});

export const useAuthForm = ({
  onSubmit: onSubmitCallback,
  redirectDelay,
}: any) => {
  const [formData, setFormData] = React.useState<any>({});
  const [errors] = React.useState<any>(mockFormState.errors);
  const [loading, setLoading] = React.useState(mockFormState.loading);
  const [error, setError] = React.useState<string | null>(mockFormState.error);
  const [success, setSuccess] = React.useState(mockFormState.success);

  const register = (name: string) => ({
    name,
    onChange: (e: any) => setFormData({ ...formData, [name]: e.target.value }),
    value: formData[name] || "",
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmitCallback?.(formData);
      setSuccess(true);
      if (redirectDelay) {
        setTimeout(() => console.log("Redirecting..."), redirectDelay);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    formState: { errors },
    loading,
    error,
    success,
    onSubmit,
  };
};

// Function to update mock form state from stories
export const setMockFormState = (newState: any) => {
  mockFormState = { ...mockFormState, ...newState };
};
