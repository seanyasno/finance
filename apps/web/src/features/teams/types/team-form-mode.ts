export const TEAM_FORM_MODES = {
  CREATE: "create",
  EDIT: "edit",
} as const;

export type TeamFormMode =
  (typeof TEAM_FORM_MODES)[keyof typeof TEAM_FORM_MODES];
