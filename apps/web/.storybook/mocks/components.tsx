// Mock for @/components
import React from "react";

// Mock PokemonCard component - this will be a fallback, but stories should use the real one
export const PokemonCard = ({ pokemonName }: { pokemonName: string }) => (
  <div className="card w-80 h-92 bg-base-100 shadow-md">
    <div className="card-body">
      <h2 className="card-title">Mock PokemonCard</h2>
      <p>Pokemon: {pokemonName}</p>
      <p>This is a mock component for when real component fails to load</p>
    </div>
  </div>
);
