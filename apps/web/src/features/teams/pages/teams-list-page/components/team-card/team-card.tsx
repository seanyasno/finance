import { Link } from "@tanstack/react-router";
import { withDefault } from "@poke-playbook/libs";
import { PokemonSprites, TeamCardMenu } from "@/features";
import type { Team } from "@/features";

type TeamCardProps = {
  team: Team;
};

export const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const pokemonCount = team.team_pokemon?.length || 0;
  const createdDate = new Date(team.created_at).toLocaleDateString();

  return (
    <Link
      to="/teams/$teamId"
      params={{ teamId: team.id }}
      className="block p-6 bg-base-100 border border-base-300 rounded-lg hover:bg-base-200/30 transition-colors group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-base-content group-hover:text-primary transition-colors line-clamp-1">
          {team.name}
        </h3>
        <div onClick={(e) => e.preventDefault()}>
          <TeamCardMenu teamId={team.id} teamName={team.name} />
        </div>
      </div>

      {team.description && (
        <p className="text-sm text-base-content/70 mb-4 line-clamp-2 leading-relaxed">
          {team.description}
        </p>
      )}

      <PokemonSprites pokemon={withDefault(team.team_pokemon, [])} />

      <div className="flex justify-between items-center text-xs text-base-content/50 mt-4 pt-3 border-t border-base-300">
        <span>{pokemonCount} of 6 Pokémon</span>
        <span>Created {createdDate}</span>
      </div>
    </Link>
  );
};
