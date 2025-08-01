import { http, HttpResponse } from "msw";
import { mockPokemon, mockPokemonList } from "../data/pokemon.mock";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export const pokemonHandlers = [
  // Get Pokemon list
  http.get(`${POKEAPI_BASE_URL}/pokemon`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    return HttpResponse.json(
      {
        ...mockPokemonList,
        results: mockPokemonList.results.slice(offset, offset + limit),
      },
      { status: 200 },
    );
  }),

  // Get Pokemon by ID or name
  http.get(`${POKEAPI_BASE_URL}/pokemon/:idOrName`, ({ params }) => {
    if (params.idOrName === "1" || params.idOrName === "bulbasaur") {
      return HttpResponse.json(mockPokemon, { status: 200 });
    }

    return HttpResponse.json({ detail: "Not found." }, { status: 404 });
  }),

  // Get Pokemon types
  http.get(`${POKEAPI_BASE_URL}/type`, () => {
    return HttpResponse.json(
      {
        count: 20,
        next: null,
        previous: null,
        results: [
          { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" },
          { name: "fighting", url: "https://pokeapi.co/api/v2/type/2/" },
          { name: "flying", url: "https://pokeapi.co/api/v2/type/3/" },
          { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
          { name: "ground", url: "https://pokeapi.co/api/v2/type/5/" },
          { name: "rock", url: "https://pokeapi.co/api/v2/type/6/" },
          { name: "bug", url: "https://pokeapi.co/api/v2/type/7/" },
          { name: "ghost", url: "https://pokeapi.co/api/v2/type/8/" },
          { name: "steel", url: "https://pokeapi.co/api/v2/type/9/" },
          { name: "fire", url: "https://pokeapi.co/api/v2/type/10/" },
          { name: "water", url: "https://pokeapi.co/api/v2/type/11/" },
          { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
        ],
      },
      { status: 200 },
    );
  }),
];
