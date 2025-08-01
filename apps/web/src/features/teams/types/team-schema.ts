import { z } from "zod";
import { TeamPokemonSchema } from "./team-pokemon-schema.ts";

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  team_pokemon: z.array(TeamPokemonSchema).optional(),
});

export type Team = z.infer<typeof TeamSchema>;
