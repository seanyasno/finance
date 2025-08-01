import React, { useMemo, useState } from "react";
import {
  usePokemonsInfinite,
  useItemsPerRowWindowChange,
  useAdvancedPokemonFilter,
} from "@/hooks";
import { purgeFlatMap, withDefault } from "@poke-playbook/libs";
import {
  SearchAndFilterHeader,
  FilterDrawerContent,
  VirtualizedPokemonGrid,
} from "./pokemon-list-components";
import { usePokemonSearchNavigation } from "./pokemon-list-hooks";
import { FETCH_LIMIT, ITEMS_PER_ROW_CONFIG } from "./pokemon-list-constants";

export const PokemonList: React.FC = () => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const { searchParams, searchInput, setSearchInput, handleApplyFilters } =
    usePokemonSearchNavigation();

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    usePokemonsInfinite(FETCH_LIMIT);

  const allPokemons = useMemo(() => {
    return purgeFlatMap(data.pages, (page) => withDefault(page.results, []));
  }, [data]);

  const { filteredPokemons, isTypeFilteringLoading, filterStats } =
    useAdvancedPokemonFilter({
      allPokemons,
      searchParams,
    });

  const itemsPerRow = useItemsPerRowWindowChange(ITEMS_PER_ROW_CONFIG);

  return (
    <div className="drawer lg:drawer-end h-full">
      <input
        id="filter-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isFilterDrawerOpen}
        onChange={(event) => setIsFilterDrawerOpen(event.target.checked)}
      />

      <div className="drawer-content flex flex-col h-full">
        <SearchAndFilterHeader
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onFilterToggle={() => setIsFilterDrawerOpen(true)}
          filterStats={filterStats}
          isTypeFilteringLoading={isTypeFilteringLoading ?? false}
        />

        <VirtualizedPokemonGrid
          filteredPokemons={filteredPokemons}
          itemsPerRow={itemsPerRow}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>

      <div className="drawer-side z-50">
        <label
          htmlFor="filter-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="bg-base-100 border-l border-base-300 text-base-content min-h-full w-full max-w-sm lg:w-80 lg:max-w-none">
          <div className="p-6">
            <FilterDrawerContent
              searchParams={searchParams}
              onApplyFilters={handleApplyFilters}
              onClose={() => setIsFilterDrawerOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
