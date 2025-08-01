import { Link } from "@tanstack/react-router";
import { useCreateTeam, useUpdateTeam } from "./hooks";
import { TeamInfoSection, PokemonSelector } from "./components";
import {
  type CreateTeamRequest,
  TEAM_FORM_MODES,
  type TeamFormData,
  type TeamFormMode,
} from "../../types";
import { useFormContext } from "react-hook-form";
import { isNotEmptyString } from "@poke-playbook/libs";
import { IoCloseCircle } from "react-icons/io5";

type CreateTeamFormProps = {
  mode: "create";
};

type EditTeamFormProps = {
  mode: "edit";
  teamId: string;
};

type TeamFormProps<Mode extends TeamFormMode> = Mode extends "create"
  ? CreateTeamFormProps
  : Mode extends "edit"
    ? EditTeamFormProps
    : never;

export function TeamForm<Mode extends TeamFormMode>(
  props: TeamFormProps<Mode>,
) {
  const { handleSubmit, formState } = useFormContext<TeamFormData>();
  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();

  const isLoading =
    createTeamMutation.isPending || updateTeamMutation.isPending;

  const onSubmit = handleSubmit(async (data) => {
    const teamData = buildTeamData(data);

    try {
      if (props.mode === TEAM_FORM_MODES.CREATE) {
        await createTeamMutation.mutateAsync(teamData);
      } else if (
        props.mode === TEAM_FORM_MODES.EDIT &&
        isNotEmptyString(props.teamId)
      ) {
        await updateTeamMutation.mutateAsync({
          teamId: props.teamId,
          data: teamData,
        });
      }
    } catch (error) {
      console.error("Failed to save team:", error);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-12">
      <TeamInfoSection />

      <PokemonSelector />

      {formState.errors.selectedPokemon && (
        <div className="p-4 rounded-lg bg-error/10 border border-error/20">
          <div className="flex items-center gap-3 text-error">
            <IoCloseCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">
              {formState.errors.selectedPokemon.message}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-8 border-t border-base-300">
        <Link
          to="/teams"
          className="text-base-content/60 hover:text-base-content transition-colors"
        >
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {props.mode === TEAM_FORM_MODES.CREATE
                ? "Creating..."
                : "Saving..."}
            </>
          ) : props.mode === TEAM_FORM_MODES.CREATE ? (
            "Create team"
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}

function buildTeamData(data: TeamFormData): CreateTeamRequest {
  return {
    name: data.teamName.trim(),
    description: data.teamDescription.trim() || undefined,
    pokemon: data.selectedPokemon.map((pokemon) => ({
      ...pokemon,
      nickname: pokemon.nickname.trim() || undefined,
    })),
  };
}
