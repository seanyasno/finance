import { useFormContext } from "react-hook-form";
import type { TeamFormData } from "../../../types";

export function TeamInfoSection() {
  const { teamName, teamDescription, updateTeamInfo, formState } =
    useTeamInfo();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-base-content mb-6">
          Team details
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-base-content mb-2">
              Name
            </label>
            <input
              type="text"
              className={`w-full px-3 py-3 border rounded-lg bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                formState.errors.teamName
                  ? "border-error focus:border-error focus:ring-error/20"
                  : "border-base-300"
              }`}
              value={teamName}
              onChange={(event) =>
                updateTeamInfo("teamName", event.target.value)
              }
              placeholder="Enter your team name"
              maxLength={255}
            />
            {formState.errors.teamName && (
              <p className="text-sm text-error mt-1">
                {formState.errors.teamName.message}
              </p>
            )}
            <p className="text-xs text-base-content/50 mt-1">
              {teamName.length}/255 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-3 border border-base-300 rounded-lg bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              rows={4}
              value={teamDescription}
              onChange={(event) =>
                updateTeamInfo("teamDescription", event.target.value)
              }
              placeholder="Describe your team strategy, theme, or any notes..."
              maxLength={500}
            />
            <p className="text-xs text-base-content/50 mt-1">
              {teamDescription.length}/500 characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function useTeamInfo() {
  const { setValue, watch, formState } = useFormContext<TeamFormData>();

  const teamName = watch("teamName");
  const teamDescription = watch("teamDescription");

  const updateTeamInfo = (
    field: keyof Pick<TeamFormData, "teamName" | "teamDescription">,
    value: string,
  ) => {
    setValue(field, value);
  };

  return {
    teamName,
    teamDescription,
    updateTeamInfo,
    formState,
  };
}
