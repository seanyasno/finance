import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsApi } from "@/constants";

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      await teamsApi.remove(teamId);

      return teamId;
    },
    onSuccess: (deletedTeamId) => {
      queryClient.setQueryData(["teams", "true"], (oldData: unknown) => {
        if (!oldData || typeof oldData !== "object") {
          return oldData;
        }

        const typedData = oldData as {
          teams: Array<{ id: string }>;
          total: number;
        };

        return {
          ...typedData,
          teams: typedData.teams.filter((team) => team.id !== deletedTeamId),
          total: typedData.total - 1,
        };
      });

      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.removeQueries({ queryKey: ["teams", deletedTeamId] });
    },
    onError: (error) => {
      console.error("Failed to delete team:", error);
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}
