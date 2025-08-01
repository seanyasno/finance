import { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { isNullOrUndefined } from "@poke-playbook/libs";
import { ROW_HEIGHT, VIRTUALIZER_OVERSCAN } from "../pokemon-list-constants";

type UsePokemonVirtualizerProps = {
  filteredPokemons: Array<{ name: string }>;
  itemsPerRow: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export const usePokemonVirtualizer = ({
  filteredPokemons,
  itemsPerRow,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UsePokemonVirtualizerProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const totalRows = Math.ceil(filteredPokemons.length / itemsPerRow);
  const virtualCount = hasNextPage ? totalRows + 1 : totalRows;

  const virtualizer = useVirtualizer({
    count: virtualCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: VIRTUALIZER_OVERSCAN,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (isNullOrUndefined(lastItem)) {
      return;
    }

    if (lastItem.index >= totalRows - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, totalRows, virtualItems]);

  return {
    parentRef,
    virtualizer,
    virtualItems,
    totalRows,
  };
}; 