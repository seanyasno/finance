import { usePokemon } from "@/hooks";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  typeGradients,
  typeShadowColors,
  typeBadgeVariants,
} from "./pokemon-card-constants";
import { isNotNullOrUndefined, withDefault } from "@poke-playbook/libs";
import { useMousePosition } from "@/hooks/use-mouse-position";
import type { PokemonType } from "@/types";

type PokemonCardProps = {
  pokemonName: string;
};

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemonName }) => {
  const { data: pokemon } = usePokemon(pokemonName);
  const cardRef = useRef<HTMLDivElement>(null);
  const { mousePosition, setMousePosition, handleMouseMove } =
    useMousePosition(cardRef);

  const primaryImage =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ??
    pokemon.sprites?.other?.home?.front_default ??
    pokemon.sprites?.front_default;

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
    <Link
      to="/pokemons/$pokemonId"
      params={{ pokemonId: pokemon.id.toString() }}
      className="block"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
        className="relative w-80 h-92 group cursor-pointer"
        style={{
          transform: `rotateX(${(mousePosition.y - 192) / 25}deg) rotateY(${(mousePosition.x - 160) / 25}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Main Card */}
        <div className="card w-full h-full bg-base-100 shadow-md drop-shadow-md backdrop-blur-sm overflow-hidden">
          {/* Subtle Background Glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${typeGradient} opacity-5`}
          />

          {/* Pokemon Image Container with 3D Effect */}
          <div className="relative h-56 flex items-center justify-center overflow-hidden">
            {/* Pokemon Image with 3D transforms */}
            {isNotNullOrUndefined(primaryImage) && (
              <div
                className="relative transform-gpu"
                style={{
                  transform: `translateZ(20px) rotateY(${(mousePosition.x - 160) / 15}deg)`,
                }}
              >
                <img
                  src={primaryImage}
                  alt={pokemon.name}
                  className="w-40 h-40 object-contain transition-all duration-300 group-hover:scale-110"
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(0, 0, 0, 0.5))",
                  }}
                />
              </div>
            )}

            {/* Pokemon ID Badge */}
            <div className="absolute top-4 right-4 bg-base-100/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-base-content border border-base-300 shadow-sm">
              #{pokemon.id.toString().padStart(3, "0")}
            </div>
          </div>

          {/* Card Content */}
          <div className="card-body relative z-10">
            {/* Pokemon Name */}
            <h2 className="card-title text-3xl capitalize tracking-wide justify-center mb-2">
              {pokemon.name}
            </h2>

            {/* Pokemon Types */}
            <div className="card-actions justify-center">
              {pokemon.types?.map((typeInfo) => (
                <div
                  key={typeInfo.type.name}
                  className={`badge badge-lg font-bold capitalize ${withDefault(typeBadgeVariants[typeInfo.type.name], "badge-ghost")}`}
                  style={{
                    boxShadow: `0 4px 20px ${shadowColor}`,
                    transform: "translateZ(10px)",
                  }}
                >
                  {typeInfo.type.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
