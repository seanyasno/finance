import { useState, useEffect } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { useDebouncedValue } from "@/hooks";
import { SEARCH_DEBOUNCE_MS } from "../pokemon-list-constants";
import type { SearchParams } from "@/types";

export const usePokemonSearchNavigation = () => {
  const searchParams = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const [searchInput, setSearchInput] = useState(searchParams.search ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedSearch !== searchParams.search) {
      navigate({
        search: {
          ...searchParams,
          search: debouncedSearch ?? undefined,
        },
      });
    }
  }, [debouncedSearch, navigate, searchParams]);

  const handleApplyFilters = (filters: Partial<SearchParams>) => {
    navigate({
      search: {
        ...searchParams,
        ...filters,
      },
    });
  };

  return {
    searchParams,
    searchInput,
    setSearchInput,
    handleApplyFilters,
  };
};
