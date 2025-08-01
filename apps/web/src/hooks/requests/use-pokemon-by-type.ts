import {
  useSuspenseQuery,
  type UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { pokemonApi } from "@/constants";
import type { TypeDetail } from "pokeapi-client";

export function usePokemonByType(
  typeName: string,
  queryOptions?: UseSuspenseQueryOptions<
    TypeDetail,
    Error,
    TypeDetail,
    string[]
  >,
) {
  return useSuspenseQuery({
    queryKey: ["pokemon-by-type", typeName],
    queryFn: async () => {
      const response = await pokemonApi.apiV2TypeRetrieve(typeName);

      return response.data;
    },
    staleTime: 1000 * 60 * 30,
    ...queryOptions,
  });
}
