import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { authApi } from "@/constants";
import type { AuthResponseDto } from "@poke-playbook/api-client";

export function useRegister(
  options?: UseMutationOptions<
    AuthResponseDto,
    Error,
    { email: string; password: string; firstName?: string; lastName?: string }
  >,
) {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      try {
        const { data } = await authApi.register({
          email,
          password,
          firstName,
          lastName,
        });
        return data;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "object" && error !== null && "response" in error
              ? (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message || "Registration failed"
              : "Registration failed";
        throw new Error(errorMessage);
      }
    },
    ...options,
  });
}
