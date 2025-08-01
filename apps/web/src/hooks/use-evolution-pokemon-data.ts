import { useSuspenseQuery } from "@tanstack/react-query";
import { pokemonApi } from "@/constants";
import { isEmptyArray } from "@poke-playbook/libs";

type EvolutionPokemon = {
  name: string;
  id: string;
};

export function useEvolutionPokemonData(evolutionPokemons: EvolutionPokemon[]) {
  const { data } = useSuspenseQuery({
    queryKey: ["evolution-pokemon-data", evolutionPokemons.map(({ id }) => id)],
    queryFn: async () => {
      if (isEmptyArray(evolutionPokemons)) {
        return [];
      }

      const promises = evolutionPokemons.map(async (pokemon) => {
        const response = await pokemonApi.apiV2PokemonRetrieve(pokemon.id);

        return {
          id: pokemon.id,
          name: pokemon.name,
          types: response.data.types,
        };
      });

      return Promise.all(promises);
    },
  });

  return data ?? [];
}
