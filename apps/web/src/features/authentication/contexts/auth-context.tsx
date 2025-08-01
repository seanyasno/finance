import React, { useState, type PropsWithChildren } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext, useLogin, useLogout, useRegister } from "../hooks";
import { type AuthResponseDtoUserUser } from "@poke-playbook/api-client";
import { authApi } from "@/constants/api-client-config";

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthResponseDtoUserUser | null>(null);

  const { isLoading } = useQuery({
    queryKey: ["auth-context"],
    queryFn: async () => {
      try {
        const {
          data: { user },
        } = await authApi.getCurrentUser();
        setUser(user);
        return user;
      } catch {
        setUser(null);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { mutateAsync: loginMutation } = useLogin({
    onSuccess: (data) => {
      if (data?.user?.user) {
        setUser(data.user.user);
      }
    },
  });

  const { mutateAsync: registerMutation } = useRegister({
    onSuccess: (data) => {
      if (data?.user?.user) {
        setUser(data.user.user);
      }
    },
  });

  const { mutateAsync: logoutMutation } = useLogout({
    onSuccess: () => {
      setUser(null);
    },
  });

  // Wrapper functions to maintain compatibility with existing components
  const login = async (props: { email: string; password: string }) => {
    try {
      await loginMutation(props);
      return { error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      return { error: { message: errorMessage } };
    }
  };

  const register = async (props: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    try {
      await registerMutation(props);
      return { error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      return { error: { message: errorMessage } };
    }
  };

  const logout = async () => {
    try {
      await logoutMutation();
      return { error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      return { error: { message: errorMessage } };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
