import type { PokemonDetail } from "@/types";

export function usePokemonImage(pokemon: PokemonDetail, isShiny: boolean) {
  const pokemonImage = isShiny
    ? pokemon.sprites.other?.["official-artwork"]?.front_shiny ??
      pokemon.sprites.other?.home?.front_shiny ??
      pokemon.sprites.front_shiny ??
      pokemon.sprites.front_default
    : pokemon.sprites.other?.["official-artwork"]?.front_default ??
      pokemon.sprites.other?.home?.front_default ??
      pokemon.sprites.front_default;

  return pokemonImage;
}
