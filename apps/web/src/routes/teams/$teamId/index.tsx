import { createFileRoute } from "@tanstack/react-router";
import { ViewTeamPage } from "@/features/teams/pages/view-team-page";

export const Route = createFileRoute("/teams/$teamId/")({
  component: ViewTeamPage,
});
