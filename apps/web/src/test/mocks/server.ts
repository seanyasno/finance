import { setupServer } from "msw/node";
import { authHandlers } from "./handlers/auth.handlers";
import { teamsHandlers } from "./handlers/teams.handlers";
import { pokemonHandlers } from "./handlers/pokemon.handlers";

export const server = setupServer(
  ...authHandlers,
  ...teamsHandlers,
  ...pokemonHandlers,
);
