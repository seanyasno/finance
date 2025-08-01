import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  type CreateTeamRequest,
  CreateTeamRequestSchema,
  TeamSchema,
} from "../../../types";
import { teamsApi } from "../../../../../constants";
import { isNullOrUndefined } from "@poke-playbook/libs";

export function useCreateTeam() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTeamRequest) => {
      const validatedData = CreateTeamRequestSchema.parse(data);
      const response = await teamsApi.create(validatedData);

      if (isNullOrUndefined(response.data)) {
        throw new Error("Failed to create team: No data returned from server");
      }

      return TeamSchema.parse(response.data);
    },
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });

      navigate({
        to: "/teams/$teamId",
        params: { teamId: team.id },
      });
    },
    onError: (error) => {
      console.error("Failed to create team:", error);
    },
  });
}
