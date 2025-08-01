import { Link } from "@tanstack/react-router";
import { TeamGrid, EmptyTeamsState } from "./components";
import { useTeams } from "./hooks";
import { useAuth } from "@/features";

export function TeamsListPage() {
  const { user, loading } = useAuth();
  const { data: teamsData } = useTeams(true);

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
          You need to be signed in to view your teams.
        </p>
        <Link to="/login" className="btn btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  const hasTeams = teamsData.teams.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-medium text-base-content mb-2 leading-tight">
            Teams
          </h1>
          <p className="text-lg text-base-content/60">
            Manage your Pokémon teams
          </p>
        </div>

        <Link to="/teams/new" className="btn btn-primary">
          Create team
        </Link>
      </div>

      {hasTeams ? <TeamGrid teams={teamsData.teams} /> : <EmptyTeamsState />}
    </div>
  );
}
