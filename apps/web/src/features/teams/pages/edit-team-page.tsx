import { useParams, Link } from "@tanstack/react-router";
import { useTeam } from "../hooks";
import {
  type Team,
  TeamForm,
  type TeamFormData,
  TeamFormProvider,
  useAuth,
} from "../../index.ts";
import { withDefault } from "@poke-playbook/libs";

export function EditTeamPage() {
  const { teamId } = useParams({ from: "/teams/$teamId/edit" });
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
          You need to be signed in to edit teams.
        </p>
        <Link to="/login" className="btn btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  const defaultValues = buildTeamFormData(team);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-medium text-base-content mb-2 leading-tight">
            {team.name}
          </h1>
          <p className="text-lg text-base-content/60">
            Edit your team details and roster
          </p>
        </div>

        <TeamFormProvider defaultValues={defaultValues}>
          <TeamForm mode="edit" teamId={teamId} />
        </TeamFormProvider>
      </div>
    </div>
  );
}

function buildTeamFormData(team: Team): TeamFormData {
  return {
    teamName: team.name,
    teamDescription: withDefault(team.description, ""),
    selectedPokemon: (team.team_pokemon || []).map((pokemon) => ({
      pokemon_id: pokemon.pokemon_id,
      pokemon_name: pokemon.pokemon_name,
      nickname: withDefault(pokemon.nickname, ""),
      position: pokemon.position,
    })),
  };
}
