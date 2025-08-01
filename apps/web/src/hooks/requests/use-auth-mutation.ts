import { useMutation } from "@tanstack/react-query";
import { isNotNullOrUndefined } from "@poke-playbook/libs";

type AuthMutationFn<Data = unknown> = (
  data: Data,
) => Promise<{ error?: { message: string } | null }>;

export const useAuthMutation = <Data = unknown>(
  onSubmit: AuthMutationFn<Data>,
  onSuccess?: (result: { error?: { message: string } | null }) => void,
  onError?: (error: Error) => void,
) => {
  return useMutation({
    mutationFn: onSubmit,
    onSuccess: (result) => {
      if (isNotNullOrUndefined(result.error)) {
        return;
      }

      onSuccess?.(result);
    },
    onError: (error: Error) => {
      console.error("Auth form error:", error);
      onError?.(error);
    },
  });
};
