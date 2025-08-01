import type { PokemonDetail } from "@/types";
import { usePokemonNavigationQueries } from "./requests/use-pokemon-navigation-queries";

const MAX_POKEMON_ID = 1025;

export function usePokemonNavigation(pokemon: PokemonDetail) {
  const previousPokemonId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextPokemonId = pokemon.id < MAX_POKEMON_ID ? pokemon.id + 1 : null;

  const pokemonQueries = usePokemonNavigationQueries(
    previousPokemonId,
    nextPokemonId,
  );
  const [previousPokemonQuery, nextPokemonQuery] = pokemonQueries;

  return {
    previousPokemonId,
    nextPokemonId,
    previousPokemonName: previousPokemonQuery.data?.name,
    nextPokemonName: nextPokemonQuery.data?.name,
  };
}
