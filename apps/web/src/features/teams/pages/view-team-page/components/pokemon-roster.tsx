import { PokemonCard } from "./pokemon-card.tsx";
import type { TeamPokemon } from "@/features";
import { isEmptyArray } from "@poke-playbook/libs";

type PokemonRosterProps = {
  pokemon: TeamPokemon[];
};

export const PokemonRoster: React.FC<PokemonRosterProps> = ({ pokemon }) => {
  const sortedPokemon = [...pokemon].sort(
    (currentPokemon, previousPokemon) =>
      currentPokemon.position - previousPokemon.position,
  );
  const pokemonSlots = Array.from({ length: 6 }, (_, index) => {
    const position = index + 1;
    return (
      sortedPokemon.find((pokemon) => pokemon.position === position) || null
    );
  });

  if (isEmptyArray(pokemon)) {
    return (
      <div className="py-16">
        <div className="text-center">
          <div className="text-5xl mb-4 opacity-40">🏃‍♂️</div>
          <h2 className="text-2xl font-medium mb-2 text-base-content/80">
            This team is empty
          </h2>
          <p className="text-base-content/50">
            Add some Pokémon to get started with your team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-medium text-base-content mb-8">
        Team roster
      </h2>
      <div className="space-y-1">
        {pokemonSlots.map((pokemon, index) => {
          const position = index + 1;

          if (!pokemon) {
            return (
              <div
                key={position}
                className="flex items-center py-3 px-4 hover:bg-base-200/30 rounded-lg transition-colors border-l-2 border-transparent"
              >
                <div className="w-10 h-10 bg-base-300/50 rounded-lg flex items-center justify-center text-xs text-base-content/40 mr-4">
                  {position}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-base-content/40 italic">
                    Empty slot
                  </div>
                </div>
              </div>
            );
          }

          return <PokemonCard key={pokemon.id} pokemon={pokemon} />;
        })}
      </div>
    </div>
  );
};
