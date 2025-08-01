import { useQueries } from "@tanstack/react-query";
import { isNotNullOrUndefined, withDefault } from "@poke-playbook/libs";
import { pokemonApi } from "@/constants";

export const usePokemonTypesQueries = (types: string[] | undefined) => {
  return useQueries({
    queries: withDefault(types, []).map((typeName) => ({
      queryKey: ["pokemon-by-type", typeName],
      queryFn: async () => {
        const response = await pokemonApi.apiV2TypeRetrieve(typeName);

        return response.data;
      },
      staleTime: 1000 * 60 * 30,
      enabled: isNotNullOrUndefined(types) && types.length > 0,
    })),
  });
};
