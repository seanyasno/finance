import React from "react";
import { PokemonCard } from "@/components/pokemon-card";
import { ErrorBoundarySuspense } from "@/components/error-boundary-suspense";
import { usePokemonVirtualizer } from "../pokemon-list-hooks";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";

type VirtualizedPokemonGridProps = {
  filteredPokemons: Array<{ name: string }>;
  itemsPerRow: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export const VirtualizedPokemonGrid: React.FC<VirtualizedPokemonGridProps> = ({
  filteredPokemons,
  itemsPerRow,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  const { parentRef, virtualizer, virtualItems, totalRows } =
    usePokemonVirtualizer({
      filteredPokemons,
      itemsPerRow,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    });

  return (
    <div className="flex-1 relative">
      <div
        ref={parentRef}
        className="h-full overflow-auto px-6"
        style={{ contain: "strict" }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualRow) => {
            const isLoaderRow = virtualRow.index >= totalRows;

            if (isLoaderRow) {
              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="flex justify-center items-center h-full">
                    {isFetchingNextPage && (
                      <div className="loading loading-spinner loading-lg"></div>
                    )}

                    {!isFetchingNextPage && hasNextPage && (
                      <div className="text-base-content/70">
                        Loading more...
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            const startIndex = virtualRow.index * itemsPerRow;
            const endIndex = Math.min(
              startIndex + itemsPerRow,
              filteredPokemons.length,
            );
            const rowPokemons = filteredPokemons.slice(startIndex, endIndex);

            return (
              <div
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center h-full">
                  {rowPokemons.map(({ name }) => (
                    <div key={name} className="w-80 h-92">
                      <ErrorBoundarySuspense fallback={<PokemonCardSkeleton />}>
                        <PokemonCard pokemonName={name} />
                      </ErrorBoundarySuspense>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
