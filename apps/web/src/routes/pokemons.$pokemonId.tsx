import React, { useState, useEffect } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  pokemonEvolutionQueryOptions,
  pokemonQueryOptions,
  usePokemon,
  usePokemonEvolution,
  usePokemonNavigation,
  usePokemonImage,
} from "@/hooks";
import {
  typeGradients,
  typeShadowColors,
} from "@/components/pokemon-card/pokemon-card-constants";
import {
  PokemonHeader,
  PokemonImageDisplay,
  PokemonEvolutionSection,
  PokemonStats,
  PokemonInfoGrid,
  PokemonVersionToggle,
} from "@/components/pokemon-detail";
import { withDefault } from "@poke-playbook/libs";
import type { PokemonType } from "@/types";
import { flattenEvolutionChain } from "@/utils";

const RouteComponent: React.FC = () => {
  const { pokemonId } = useParams({ from: "/pokemons/$pokemonId" });
  const { data: pokemon } = usePokemon(pokemonId);
  const { data: evolutionChain } = usePokemonEvolution(pokemonId);
  const [isShiny, setIsShiny] = useState(false);

  useEffect(() => {
    if (pokemon) {
      const pokemonName =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      const pokemonTypes =
        pokemon.types
          ?.map((t: { type: { name: string } }) => t.type.name)
          .join(", ") || "";

      document.title = `${pokemonName} - Pokémon Details | Poke Playbook`;

      const setMetaTag = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", name);
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", content);
      };

      const setOgTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("property", property);
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", content);
      };

      setMetaTag(
        "description",
        `Discover ${pokemonName}, a ${pokemonTypes} type Pokémon. View detailed stats, evolution chain, and abilities. Build your perfect team with ${pokemonName} on Poke Playbook.`,
      );
      setMetaTag(
        "keywords",
        `${pokemonName}, pokemon, ${pokemonTypes}, stats, evolution, abilities, team builder, pokedex`,
      );

      setOgTag("og:title", `${pokemonName} - Pokémon Details | Poke Playbook`);
      setOgTag(
        "og:description",
        `Discover ${pokemonName}, a ${pokemonTypes} type Pokémon. View detailed stats, evolution chain, and abilities.`,
      );
      setOgTag(
        "og:url",
        `https://poke-playbook.seanyasno.com/pokemons/${pokemon.id || pokemonName.toLowerCase()}`,
      );

      const imageUrl =
        pokemon.sprites?.other?.["official-artwork"]?.front_default ||
        pokemon.sprites?.front_default ||
        "https://poke-playbook.seanyasno.com/og-image.png";
      setOgTag("og:image", imageUrl);
      setOgTag("og:image:alt", `${pokemonName} official artwork`);

      setMetaTag(
        "twitter:title",
        `${pokemonName} - Pokémon Details | Poke Playbook`,
      );
      setMetaTag(
        "twitter:description",
        `Discover ${pokemonName}, a ${pokemonTypes} type Pokémon. View detailed stats, evolution chain, and abilities.`,
      );
      setMetaTag("twitter:image", imageUrl);
    }
  }, [pokemon]);

  const {
    previousPokemonId,
    nextPokemonId,
    previousPokemonName,
    nextPokemonName,
  } = usePokemonNavigation(pokemon);
  const pokemonImage = usePokemonImage(pokemon, isShiny);

  const evolutionPokemons = evolutionChain?.chain
    ? flattenEvolutionChain(evolutionChain.chain)
    : [];

  const primaryType: PokemonType = withDefault(
    pokemon.types?.[0]?.type?.name,
    "normal",
  );
  const typeGradient = withDefault(
    typeGradients[primaryType],
    typeGradients.normal,
  );
  const shadowColor = withDefault(
    typeShadowColors[primaryType],
    typeShadowColors.normal,
  );

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 md:py-10 md:px-20 py-5 px-5">
      <div
        className={`fixed inset-0 w-screen h-screen bg-gradient-to-br ${typeGradient} opacity-5 pointer-events-none -z-10`}
      />

      <div className="flex flex-col gap-8">
        <div className="block lg:hidden">
          <PokemonHeader pokemon={pokemon} shadowColor={shadowColor} />
        </div>

        <PokemonImageDisplay
          pokemon={pokemon}
          pokemonImage={pokemonImage}
          isShiny={isShiny}
          shadowColor={shadowColor}
          previousPokemonId={previousPokemonId}
          nextPokemonId={nextPokemonId}
          previousPokemonName={previousPokemonName}
          nextPokemonName={nextPokemonName}
        />

        <PokemonEvolutionSection evolutionPokemons={evolutionPokemons} />
      </div>

      <div className="flex flex-col gap-6">
        <div className="hidden lg:block">
          <PokemonHeader pokemon={pokemon} shadowColor={shadowColor} />
        </div>

        <div className="flex flex-col gap-6">
          <PokemonVersionToggle isShiny={isShiny} onToggle={setIsShiny} />

          <PokemonInfoGrid pokemon={pokemon} />

          <PokemonStats pokemon={pokemon} />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/pokemons/$pokemonId")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { pokemonId } }) => {
    const pokemon = await queryClient.ensureQueryData(
      pokemonQueryOptions(pokemonId),
    );
    const evolution = await queryClient.ensureQueryData(
      pokemonEvolutionQueryOptions(pokemonId),
    );

    return { pokemon, evolution };
  },
});
