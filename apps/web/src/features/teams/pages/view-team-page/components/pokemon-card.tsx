import { Link } from "@tanstack/react-router";
import type { TeamPokemon } from "@/features";

type PokemonCardProps = {
  pokemon: TeamPokemon;
};

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <Link
      to="/pokemons/$pokemonId"
      params={{ pokemonId: pokemon.pokemon_id.toString() }}
      className="flex items-center py-3 px-4 hover:bg-base-200/30 rounded-lg transition-colors border-l-2 border-transparent hover:border-l-primary group"
    >
      <div className="w-10 h-10 bg-base-300/50 rounded-lg flex items-center justify-center text-xs text-base-content/60 mr-4 font-medium">
        {pokemon.position}
      </div>

      <div className="w-12 h-12 flex items-center justify-center mr-4">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`}
          alt={pokemon.pokemon_name}
          className="w-10 h-10 object-contain opacity-90"
          onError={(e) => {
            e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`;
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-base-content group-hover:text-primary transition-colors truncate">
            {pokemon.nickname || pokemon.pokemon_name}
          </h3>
          {pokemon.nickname && (
            <span className="text-xs text-base-content/50 font-mono">
              #{pokemon.pokemon_id.toString().padStart(3, "0")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-base-content/50">
          <span>{pokemon.pokemon_name}</span>
          <span>Added {new Date(pokemon.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-base-content/40">
        →
      </div>
    </Link>
  );
};
