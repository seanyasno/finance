import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { authApi } from "@/constants";

export function useLogout(options?: UseMutationOptions<void, Error>) {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await authApi.logout();
    },
    ...options,
  });
}
