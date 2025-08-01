import { z } from "zod";

export const TeamPokemonSchema = z.object({
  id: z.string(),
  pokemon_id: z.number(),
  pokemon_name: z.string(),
  nickname: z.string().nullable(),
  position: z.number(),
  created_at: z.string(),
});

export type TeamPokemon = z.infer<typeof TeamPokemonSchema>;
