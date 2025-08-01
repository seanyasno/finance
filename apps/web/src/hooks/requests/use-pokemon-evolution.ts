import {
  queryOptions,
  useSuspenseQuery,
  type UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { evolutionApi, pokemonApi } from "@/constants";
import type { EvolutionChainDetail } from "pokeapi-client";

export function pokemonEvolutionQueryOptions(pokemonNameOrId: string) {
  return queryOptions({
    queryKey: ["pokemon-evolution", pokemonNameOrId],
    queryFn: async () => {
      const pokemonResponse =
        await pokemonApi.apiV2PokemonRetrieve(pokemonNameOrId);
      const speciesUrl = pokemonResponse.data.species.url;

      const speciesId = speciesUrl.split("/").filter(Boolean).pop();

      const speciesResponse = await pokemonApi.apiV2PokemonSpeciesRetrieve(
        speciesId!,
      );
      const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

      const evolutionChainId = evolutionChainUrl
        .split("/")
        .filter(Boolean)
        .pop();

      const response = await evolutionApi.apiV2EvolutionChainRetrieve(
        evolutionChainId!,
      );

      return response.data;
    },
  });
}

export function usePokemonEvolution(
  pokemonNameOrId: string,
  queryOptions?: UseSuspenseQueryOptions<
    EvolutionChainDetail,
    Error,
    EvolutionChainDetail,
    string[]
  >,
) {
  return useSuspenseQuery({
    ...pokemonEvolutionQueryOptions(pokemonNameOrId),
    ...queryOptions,
  });
}
