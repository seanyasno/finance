import { useParams, Link } from "@tanstack/react-router";
import { useTeam, useAuth } from "@/features";
import { TeamHeader, PokemonRoster } from "./components";
import { withDefault } from "@poke-playbook/libs";

export const ViewTeamPage: React.FC = () => {
  const { teamId } = useParams({ from: "/teams/$teamId/" });
  const { user, loading } = useAuth();
  const { data: team } = useTeam(teamId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <h2 className="text-2xl font-medium mb-4">Sign in required</h2>
        <p className="text-base-content/60 mb-6">
          You need to be signed in to view teams.
        </p>
        <Link to="/login" className="btn btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full bg-base-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <TeamHeader team={team} />
        <div className="mt-12">
          <PokemonRoster pokemon={withDefault(team.team_pokemon, [])} />
        </div>
      </div>
    </div>
  );
};
