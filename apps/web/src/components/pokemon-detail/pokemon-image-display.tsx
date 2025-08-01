import { Link } from "@tanstack/react-router";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { capitalize } from "@poke-playbook/libs";
import type { PokemonDetail } from "@/types";

type PokemonImageDisplayProps = {
  pokemon: PokemonDetail;
  pokemonImage: string | null;
  isShiny: boolean;
  shadowColor: string;
  previousPokemonId: number | null;
  nextPokemonId: number | null;
  previousPokemonName?: string;
  nextPokemonName?: string;
};

export function PokemonImageDisplay({
  pokemon,
  pokemonImage,
  isShiny,
  shadowColor,
  previousPokemonId,
  nextPokemonId,
  previousPokemonName,
  nextPokemonName,
}: PokemonImageDisplayProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-4 relative">
      {previousPokemonId && (
        <Link
          to="/pokemons/$pokemonId"
          params={{ pokemonId: previousPokemonId.toString() }}
          className="hidden absolute left-0 md:flex gap-1 items-center"
        >
          <IoChevronBack className="w-5 h-5" />
          <div className="flex flex-col items-start">
            <span className="font-semibold">
              #{previousPokemonId.toString().padStart(3, "0")}
            </span>
            {previousPokemonName && (
              <span className="text-xs text-gray-500 capitalize">
                {previousPokemonName}
              </span>
            )}
          </div>
        </Link>
      )}

      <div className="w-full flex justify-center">
        <div className="relative">
          <img
            src={pokemonImage ?? "/placeholder-pokemon.png"}
            alt={`${capitalize(pokemon.name)} ${isShiny ? "shiny" : "normal"} render`}
            className="w-80 h-80 object-contain transition-all duration-300 hover:scale-105"
            style={{
              filter: `drop-shadow(0 0 20px ${shadowColor})`,
            }}
          />
        </div>
      </div>

      {nextPokemonId && (
        <Link
          to="/pokemons/$pokemonId"
          params={{ pokemonId: nextPokemonId.toString() }}
          className="hidden absolute right-0 items-center md:flex gap-1"
        >
          <div className="flex flex-col items-end">
            <span className="font-semibold">
              #{nextPokemonId.toString().padStart(3, "0")}
            </span>
            {nextPokemonName && (
              <span className="text-xs text-gray-500 capitalize">
                {nextPokemonName}
              </span>
            )}
          </div>
          <IoChevronForward className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
