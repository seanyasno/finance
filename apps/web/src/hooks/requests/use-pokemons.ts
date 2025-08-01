import {
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
  type UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { pokemonApi } from "@/constants";
import type { PaginatedPokemonSummaryList } from "pokeapi-client";

export function usePokemons(
  limit?: number,
  offset?: number,
  query?: string,
  queryOptions?: UseSuspenseQueryOptions<
    PaginatedPokemonSummaryList,
    Error,
    PaginatedPokemonSummaryList,
    string[]
  >,
) {
  return useSuspenseQuery({
    queryKey: ["pokemons"],
    queryFn: async () => {
      const response = await pokemonApi.apiV2PokemonList(limit, offset, query);

      return response.data;
    },
    ...queryOptions,
  });
}

export function usePokemonsInfinite(limit: number = 20) {
  return useSuspenseInfiniteQuery({
    queryKey: ["pokemons", "infinite", limit.toString()],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await pokemonApi.apiV2PokemonList(
        limit,
        pageParam as number,
      );

      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length * limit;
      }

      return undefined;
    },
    initialPageParam: 0,
  });
}
