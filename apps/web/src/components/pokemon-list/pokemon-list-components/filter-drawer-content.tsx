import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { usePokemonTypes, usePokemonGames } from "@/hooks";
import type { SearchParams } from "@/types";

type FilterDrawerContentProps = {
  searchParams: SearchParams;
  onApplyFilters: (filters: Partial<SearchParams>) => void;
  onClose: () => void;
};

export const FilterDrawerContent: React.FC<FilterDrawerContentProps> = ({
  searchParams,
  onApplyFilters,
  onClose,
}) => {
  const { data: typesData } = usePokemonTypes();
  const { data: gamesData } = usePokemonGames();

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.types ?? [],
  );
  const [selectedGame, setSelectedGame] = useState<string>(
    searchParams.game ?? "",
  );

  const handleApply = () => {
    onApplyFilters({
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      game: selectedGame ?? undefined,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedTypes([]);
    setSelectedGame("");
    onApplyFilters({
      types: undefined,
      game: undefined,
    });
    onClose();
  };

  const handleTypeToggle = (typeName: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName)
        ? prev.filter((t) => t !== typeName)
        : [...prev, typeName],
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-base-content">Filters</h2>
        <button
          className="p-2 hover:bg-base-200 rounded-lg transition-colors"
          onClick={onClose}
          aria-label="Close filters"
        >
          <IoClose className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 space-y-8">
        <div>
          <label className="block text-sm font-medium text-base-content mb-3">
            Game
          </label>
          <select
            className="w-full px-3 py-3 border border-base-300 rounded-lg bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
          >
            <option value="">All games</option>
            {gamesData?.results?.map((game) => (
              <option key={game.name} value={game.name}>
                {game.name.charAt(0).toUpperCase() + game.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-base-content mb-3">
            Types
          </label>
          <div className="text-xs text-base-content/60 mb-4">
            Select multiple types to find Pokémon with ALL selected types
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {typesData?.results?.map((type) => (
              <label
                key={type.name}
                className="flex items-center gap-3 p-2 hover:bg-base-200/30 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary bg-base-100 border-base-300 rounded focus:ring-primary/20 focus:ring-2"
                  checked={selectedTypes.includes(type.name)}
                  onChange={() => handleTypeToggle(type.name)}
                />
                <span className="text-sm text-base-content capitalize">
                  {type.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-base-300 mt-auto">
        <button className="btn btn-primary flex-1" onClick={handleApply}>
          Apply filters
        </button>
        <button
          className="flex-1 text-base-content/60 hover:text-base-content transition-colors px-3 py-2"
          onClick={handleClear}
        >
          Clear all
        </button>
      </div>
    </div>
  );
};
