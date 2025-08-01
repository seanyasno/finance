import { useQueries } from "@tanstack/react-query";
import { pokemonApi } from "@/constants";
import { PokemonDetailSchema } from "@/types/pokemon-detail-schema";
import { isNotNullOrUndefined } from "@poke-playbook/libs";

export const usePokemonNavigationQueries = (
  prevPokemonId: number | null,
  nextPokemonId: number | null,
) => {
  return useQueries({
    queries: [
      {
        queryKey: ["pokemon", prevPokemonId?.toString()],
        queryFn: async () => {
          const response = await pokemonApi.apiV2PokemonRetrieve(
            prevPokemonId!.toString(),
          );

          return PokemonDetailSchema.parse(response.data);
        },
        enabled: isNotNullOrUndefined(prevPokemonId),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["pokemon", nextPokemonId?.toString()],
        queryFn: async () => {
          const response = await pokemonApi.apiV2PokemonRetrieve(
            nextPokemonId!.toString(),
          );

          return PokemonDetailSchema.parse(response.data);
        },
        enabled: isNotNullOrUndefined(nextPokemonId),
        staleTime: 1000 * 60 * 5,
      },
    ],
  });
};
