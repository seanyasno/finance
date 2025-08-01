import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TeamsListPage } from "@/features";

const TeamsComponent: React.FC = () => {
  useEffect(() => {
    document.title = "My Pokémon Teams - Poke Playbook";

    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setMetaTag(
      "description",
      "View and manage all your custom Pokémon teams. Create strategic lineups, edit existing teams, and organize your Pokémon collection for battles and adventures.",
    );
    setMetaTag(
      "keywords",
      "pokemon teams, team management, pokemon strategy, team builder, pokemon collection, battle teams",
    );
  }, []);

  return <TeamsListPage />;
};

export const Route = createFileRoute("/teams/")({
  component: TeamsComponent,
});
