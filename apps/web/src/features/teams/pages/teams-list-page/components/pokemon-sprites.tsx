import type { TeamPokemon } from "../../../types";
import { isEmptyArray } from "@poke-playbook/libs";

const MAX_SPRITES = 4;

type PokemonSpritesProps = {
  pokemon: TeamPokemon[];
};

export const PokemonSprites: React.FC<PokemonSpritesProps> = ({ pokemon }) => {
  const sortedPokemon = [...pokemon].sort(
    (currentPokemon, previousPokemon) =>
      currentPokemon.position - previousPokemon.position,
  );
  const displayPokemon = sortedPokemon.slice(0, MAX_SPRITES);
  const remainingCount = Math.max(0, pokemon.length - MAX_SPRITES);

  if (isEmptyArray(pokemon)) {
    return (
      <div className="flex items-center justify-center h-16 bg-base-200 rounded-lg">
        <span className="text-sm text-base-content/50">No Pokémon yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 h-16">
      {displayPokemon.map((pokemon) => (
        <div
          key={pokemon.id}
          className="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center overflow-hidden"
          title={pokemon.nickname || pokemon.pokemon_name}
        >
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`}
            alt={pokemon.pokemon_name}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`;
            }}
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="w-12 h-12 bg-base-300 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-base-content/70">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
};
