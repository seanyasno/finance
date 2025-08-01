import {
  useSuspenseQuery,
  type UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { gamesApi } from "@/constants";
import type { PaginatedVersionSummaryList } from "pokeapi-client";

const MAX_GAME_VERSIONS = 50;

export function usePokemonGames(
  queryOptions?: UseSuspenseQueryOptions<
    PaginatedVersionSummaryList,
    Error,
    PaginatedVersionSummaryList,
    string[]
  >,
) {
  return useSuspenseQuery({
    queryKey: ["pokemon-games"],
    queryFn: async () => {
      const response = await gamesApi.apiV2VersionList(MAX_GAME_VERSIONS);

      return response.data;
    },
    staleTime: 1000 * 60 * 60,
    ...queryOptions,
  });
}
