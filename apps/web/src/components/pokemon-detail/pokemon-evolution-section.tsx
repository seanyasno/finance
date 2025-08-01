import { Link } from "@tanstack/react-router";
import { capitalize, withDefault } from "@poke-playbook/libs";
import { useEvolutionPokemonData } from "@/hooks";
import {
  typeBadgeVariants,
  typeShadowColors,
  typeGradients,
} from "@/components/pokemon-card/pokemon-card-constants";
import { PokemonTypeSchema, type PokemonType } from "@/types";

type EvolutionPokemon = {
  name: string;
  id: string;
};

type PokemonEvolutionSectionProps = {
  evolutionPokemons: EvolutionPokemon[];
};

export function PokemonEvolutionSection({
  evolutionPokemons,
}: PokemonEvolutionSectionProps) {
  const evolutionData = useEvolutionPokemonData(evolutionPokemons);

  if (evolutionPokemons.length <= 1) {
    return null;
  }

  return (
    <div className="card-body">
      <div className="flex flex-wrap justify-center items-center gap-6">
        {evolutionData.map((evolutionPokemon) => {
          const primaryType: PokemonType = withDefault(
            PokemonTypeSchema.parse(evolutionPokemon.types?.[0]?.type?.name),
            "normal",
          );
          const typeGradient = withDefault(
            typeGradients[primaryType],
            typeGradients.normal,
          );
          const typeShadowColor = withDefault(
            typeShadowColors[primaryType],
            typeShadowColors.normal,
          );

          return (
            <div
              key={evolutionPokemon.id}
              className="flex flex-col items-center"
            >
              <Link
                to="/pokemons/$pokemonId"
                params={{ pokemonId: evolutionPokemon.id }}
                className="block group"
              >
                <div className="flex flex-col items-center gap-3 p-4 hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <div
                      className={`w-24 h-24 rounded-full bg-gradient-to-br ${typeGradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      style={{
                        boxShadow: `0 4px 20px ${typeShadowColor}`,
                        padding: "2px",
                      }}
                    >
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionPokemon.id}.png`}
                          alt={evolutionPokemon.name}
                          className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 min-w-[120px]">
                    <div className="flex gap-x-1.5">
                      <h4 className="text-sm  text-gray-800 capitalize leading-tight">
                        {capitalize(evolutionPokemon.name)}
                      </h4>
                      <p className="text-xs text-gray-500">
                        #{evolutionPokemon.id.padStart(3, "0")}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-1">
                      {evolutionPokemon.types.map((type) => (
                        <div
                          key={type.type.name}
                          className={`badge badge-xs font-bold capitalize ${withDefault(
                            typeBadgeVariants[type.type.name as PokemonType],
                            "badge-ghost",
                          )}`}
                        >
                          {type.type.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
