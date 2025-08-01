import React, { useRef, useEffect } from "react";
import { IoFilter, IoSearch } from "react-icons/io5";
import type { SearchAndFilterHeaderProps } from "../pokemon-list-types";

export const SearchAndFilterHeader: React.FC<SearchAndFilterHeaderProps> = ({
  searchValue,
  onSearchChange,
  onFilterToggle,
  filterStats,
  isTypeFilteringLoading,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="border-b border-base-300 bg-base-100">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-md">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/40" />
              <input
                ref={searchInputRef}
                type="search"
                className="w-full pl-10 pr-20 py-2.5 border border-base-300 rounded-lg bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Search Pokémon..."
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                <kbd className="px-1.5 py-1 text-xs bg-base-200 border border-base-300 rounded font-mono">
                  ⌘
                </kbd>
                <kbd className="px-1.5 py-1 text-xs bg-base-200 border border-base-300 rounded font-mono">
                  K
                </kbd>
              </div>
            </div>
            <button
              className="p-2.5 border border-base-300 rounded-lg hover:bg-base-200/50 transition-colors"
              onClick={onFilterToggle}
              aria-label="Open filters"
            >
              <IoFilter className="w-4 h-4" />
            </button>
          </div>

          {filterStats.hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm">
              {isTypeFilteringLoading && (
                <div className="loading loading-spinner loading-sm"></div>
              )}
              <span className="text-base-content/60">
                Showing {filterStats.filteredCount} of {filterStats.totalCount}{" "}
                Pokémon
                {filterStats.reductionPercentage > 0 && (
                  <span className="text-primary ml-1">
                    ({filterStats.reductionPercentage}% filtered)
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
