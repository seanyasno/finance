import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { authApi } from "@/constants";
import type { AuthResponseDto } from "@poke-playbook/api-client";

export function useLogin(
  options?: UseMutationOptions<
    AuthResponseDto,
    Error,
    { email: string; password: string }
  >,
) {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      try {
        const { data } = await authApi.login({ email, password });
        return data;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "object" && error !== null && "response" in error
              ? (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message || "Login failed"
              : "Login failed";
        throw new Error(errorMessage);
      }
    },
    ...options,
  });
}
