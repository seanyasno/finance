import { createFileRoute } from "@tanstack/react-router";
import { EditTeamPage } from "@/features";

export const Route = createFileRoute("/teams/$teamId/edit")({
  component: EditTeamPage,
});
