import type { FilterStats } from "./filter-stats";

export type SearchAndFilterHeaderProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterToggle: () => void;
  filterStats: FilterStats;
  isTypeFilteringLoading: boolean;
}; 