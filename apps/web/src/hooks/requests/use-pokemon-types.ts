import {
  useSuspenseQuery,
  type UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { pokemonApi } from "@/constants";
import type { PaginatedTypeSummaryList } from "pokeapi-client";

const MAX_POKEMON_TYPES = 20;

export function usePokemonTypes(
  queryOptions?: UseSuspenseQueryOptions<
    PaginatedTypeSummaryList,
    Error,
    PaginatedTypeSummaryList,
    string[]
  >,
) {
  return useSuspenseQuery({
    queryKey: ["pokemon-types"],
    queryFn: async () => {
      const response = await pokemonApi.apiV2TypeList(MAX_POKEMON_TYPES);

      return response.data;
    },
    staleTime: 1000 * 60 * 60,
    ...queryOptions,
  });
}
