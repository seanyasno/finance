import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CreateTeamPage } from "@/features";

const CreateTeamComponent: React.FC = () => {
  useEffect(() => {
    document.title = "Create New Pokémon Team - Poke Playbook";

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
      "Build your perfect Pokémon team from scratch. Choose your favorite Pokémon, plan strategic combinations, and create the ultimate battle-ready lineup.",
    );
    setMetaTag(
      "keywords",
      "create pokemon team, team builder, pokemon strategy, new team, pokemon selection, battle team creation",
    );
  }, []);

  return <CreateTeamPage />;
};

export const Route = createFileRoute("/teams/new")({
  component: CreateTeamComponent,
});
