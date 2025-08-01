import { z } from "zod";

export const CreateTeamRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  pokemon: z
    .array(
      z.object({
        pokemon_id: z.number().int().positive(),
        pokemon_name: z.string().min(1),
        nickname: z.string().optional(),
        position: z.number().int().min(1).max(6),
      }),
    )
    .max(6)
    .default([]),
});

export type CreateTeamRequest = z.infer<typeof CreateTeamRequestSchema>;
