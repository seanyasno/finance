import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { teamsApi } from "@/constants";
import { type TeamsList, TeamsListSchema } from "@/features";

function teamsQueryOptions(includePokemons = true) {
  return queryOptions({
    queryKey: ["teams", includePokemons.toString()],
    queryFn: async () => {
      const response = await teamsApi.findAll(includePokemons);
      return TeamsListSchema.parse(response.data);
    },
  });
}

export function useTeams(
  includePokemons = true,
  queryOptions?: UseSuspenseQueryOptions<TeamsList, Error, TeamsList, string[]>,
) {
  return useSuspenseQuery({
    ...teamsQueryOptions(includePokemons),
    ...queryOptions,
  });
}
