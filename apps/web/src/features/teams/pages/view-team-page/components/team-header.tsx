import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { type Team, DeleteTeamDialog } from "@/features";
import { IoPencil, IoTrash } from "react-icons/io5";
import { withDefault } from "@poke-playbook/libs";

type TeamHeaderProps = {
  team: Team;
};

export const TeamHeader: React.FC<TeamHeaderProps> = ({ team }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const createdDate = new Date(team.created_at).toLocaleDateString();
  const updatedDate = new Date(team.updated_at).toLocaleDateString();
  const pokemonCount = withDefault(team.team_pokemon?.length, 0);

  return (
    <>
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-5xl font-medium text-base-content mb-3 leading-tight">
              {team.name}
            </h1>

            {team.description && (
              <p className="text-lg text-base-content/70 mb-4 leading-relaxed max-w-2xl">
                {team.description}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm text-base-content/50">
              <span>{pokemonCount} of 6 Pokémon</span>
              <span>Created {createdDate}</span>
              {createdDate !== updatedDate && (
                <span>Last updated {updatedDate}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-6">
            <Link
              to="/teams/$teamId/edit"
              params={{ teamId: team.id }}
              className="btn btn-sm btn-ghost"
            >
              <IoPencil className="w-4 h-4" />
            </Link>

            <button
              className="btn btn-sm btn-ghost text-error hover:bg-error/10"
              onClick={() => setShowDeleteDialog(true)}
            >
              <IoTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <DeleteTeamDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        teamId={team.id}
        teamName={team.name}
      />
    </>
  );
};
