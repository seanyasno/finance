import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { type Team, TeamSchema } from "../types";
import { teamsApi } from "@/constants";
import { isNullOrUndefined } from "@poke-playbook/libs";

function teamQueryOptions(teamId: string) {
  return queryOptions({
    queryKey: ["teams", teamId],
    queryFn: async () => {
      const response = await teamsApi.findAll(true);
      const teamsData = response.data;
      const team = teamsData.teams.find((team) => team.id === teamId);

      if (isNullOrUndefined(team)) {
        throw new Error("Team not found");
      }

      return TeamSchema.parse(team);
    },
  });
}

export function useTeam(
  teamId: string,
  queryOptions?: UseSuspenseQueryOptions<Team, Error, Team, string[]>,
) {
  return useSuspenseQuery({
    ...teamQueryOptions(teamId),
    ...queryOptions,
  });
}
