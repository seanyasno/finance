import { capitalize } from "@poke-playbook/libs";
import type { PokemonDetail } from "@/types";
import { formatHeight, formatWeight } from "@/utils";

type PokemonInfoGridProps = {
  pokemon: PokemonDetail;
};

export function PokemonInfoGrid({ pokemon }: PokemonInfoGridProps) {
  const abilities = pokemon.abilities
    .filter((ability) => !ability.is_hidden)
    .map((ability) => capitalize(ability.ability.name))
    .join(", ");

  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow bg-white">
      <div className="stat">
        <div className="stat-title">Height</div>
        <div className="stat-value text-lg">{formatHeight(pokemon.height)}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Weight</div>
        <div className="stat-value text-lg">{formatWeight(pokemon.weight)}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Abilities</div>
        <div className="stat-value text-sm">{abilities}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Experience</div>
        <div className="stat-value text-lg">{pokemon.base_experience}</div>
      </div>
    </div>
  );
}
