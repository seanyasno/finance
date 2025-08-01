import { z } from "zod";

export const PokemonTypes = {
  FIRE: "fire",
  WATER: "water",
  GRASS: "grass",
  ELECTRIC: "electric",
  PSYCHIC: "psychic",
  ICE: "ice",
  DRAGON: "dragon",
  DARK: "dark",
  NORMAL: "normal",
  FIGHTING: "fighting",
  POISON: "poison",
  GROUND: "ground",
  FLYING: "flying",
  BUG: "bug",
  ROCK: "rock",
  GHOST: "ghost",
  STEEL: "steel",
  FAIRY: "fairy",
} as const;

export const PokemonTypeSchema = z.nativeEnum(PokemonTypes);
export type PokemonType = z.infer<typeof PokemonTypeSchema>;
