/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// Mock for @/hooks
let mockPokemonData: any = {
  id: 1,
  name: "bulbasaur",
  sprites: {
    other: {
      "official-artwork": {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      },
    },
  },
  types: [
    {
      type: {
        name: "grass",
      },
    },
  ],
};

export const usePokemon = (_pokemonName: string) => ({
  data: mockPokemonData,
});

export const useMousePosition = (_ref: any) => ({
  mousePosition: { x: 0, y: 0 },
  setMousePosition: () => console.log("Set mouse position"),
  handleMouseMove: () => console.log("Handle mouse move"),
});

// Mock additional hooks
export const usePokemonTypes = () => ({
  data: [
    { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" },
    { name: "fire", url: "https://pokeapi.co/api/v2/type/2/" },
    { name: "water", url: "https://pokeapi.co/api/v2/type/3/" },
  ],
  loading: false,
  error: null,
});

export const usePokemonGames = () => ({
  data: [
    { name: "red", url: "https://pokeapi.co/api/v2/version/1/" },
    { name: "blue", url: "https://pokeapi.co/api/v2/version/2/" },
    { name: "yellow", url: "https://pokeapi.co/api/v2/version/3/" },
  ],
  loading: false,
  error: null,
});

export const useDebouncedValue = (value: any, _delay: number) => value;

export const usePokemonsInfinite = (_params: any) => ({
  data: {
    pages: [
      {
        results: [mockPokemonData],
        next: null,
      },
    ],
  },
  fetchNextPage: () => console.log("Fetch next page"),
  hasNextPage: false,
  isFetchingNextPage: false,
  isLoading: false,
  error: null,
});

export const useItemsPerRowWindowChange = () => ({
  itemsPerRow: 4,
  setItemsPerRow: (_items: number) => console.log("Set items per row"),
});

export const useAdvancedPokemonFilter = () => ({
  filters: {},
  setFilters: (_filters: any) => console.log("Set filters"),
  clearFilters: () => console.log("Clear filters"),
});

// Function to update mock Pokemon data from stories
export const setMockPokemonData = (newData: any) => {
  mockPokemonData = { ...mockPokemonData, ...newData };
};
