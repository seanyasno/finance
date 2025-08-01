import { capitalize } from "@poke-playbook/libs";
import { withDefault } from "@poke-playbook/libs";
import { typeBadgeVariants } from "@/components/pokemon-card/pokemon-card-constants";
import type { PokemonDetail, PokemonType } from "@/types";

type PokemonHeaderProps = {
  pokemon: PokemonDetail;
  shadowColor: string;
};

export function PokemonHeader({ pokemon, shadowColor }: PokemonHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="text-4xl font-bold text-gray-800">
        {capitalize(pokemon.name)}
      </h1>
      <span className="text-gray-400 text-lg font-medium">
        #{pokemon.id.toString().padStart(3, "0")}
      </span>
      <div className="flex gap-2">
        {pokemon.types.map((type) => (
          <div
            key={type.type.name}
            className={`badge badge-lg font-bold capitalize ${withDefault(
              typeBadgeVariants[type.type.name as PokemonType],
              "badge-ghost",
            )}`}
            style={{
              boxShadow: `0 4px 20px ${shadowColor}`,
              transform: "translateZ(10px)",
            }}
          >
            {type.type.name}
          </div>
        ))}
      </div>
    </div>
  );
}
