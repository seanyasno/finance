import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { ErrorBoundarySuspense, PokemonList } from "@/components";
import { SearchParamsSchema } from "@/types";

const Index: React.FC = () => {
  useEffect(() => {
    document.title =
      "Poke Playbook - Build and Manage Your Ultimate Pokémon Teams";

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
      "Discover and explore all Pokémon with our comprehensive Pokédex. Build strategic teams, view detailed stats, and enhance your Pokémon gaming experience with Poke Playbook.",
    );
    setMetaTag(
      "keywords",
      "pokemon, pokedex, team builder, pokemon teams, pokemon stats, gaming, portfolio project, sean yasnogorodski, pokemon search, pokemon database",
    );
  }, []);

  return (
    <ErrorBoundarySuspense>
      <PokemonList />
    </ErrorBoundarySuspense>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: zodSearchValidator(SearchParamsSchema),
});
