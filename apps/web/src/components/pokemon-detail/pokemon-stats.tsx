import type { PokemonDetail } from "@/types";
import { formatStatName } from "@/utils";

type PokemonStatsProps = {
  pokemon: PokemonDetail;
};

const getStatColor = (value: number) => {
  if (value < 50) return "progress-error";
  if (value < 100) return "progress-warning";
  return "progress-success";
};

export function PokemonStats({ pokemon }: PokemonStatsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Stats</h3>
      <div className="space-y-2">
        {pokemon.stats.map((stat) => (
          <div key={stat.stat.name} className="flex items-center gap-3">
            <div className="w-20 text-sm text-gray-500 font-medium">
              {formatStatName(stat.stat.name)}
            </div>
            <div className="w-10 text-sm font-bold text-gray-800 text-right">
              {stat.base_stat}
            </div>
            <progress
              className={`progress flex-1 ${getStatColor(stat.base_stat)}`}
              value={stat.base_stat}
              max="255"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
