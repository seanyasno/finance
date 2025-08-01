import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const TeamPokemonResponseSchema = z.object({
  id: z.string(),
  team_id: z.string(),
  pokemon_id: z.number(),
  pokemon_name: z.string(),
  nickname: z.string().nullable(),
  position: z.number(),
  created_at: z
    .union([z.string(), z.date()])
    .transform((val) => (val instanceof Date ? val.toISOString() : val)),
});

export const TeamResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  user_id: z.string(),
  created_at: z
    .union([z.string(), z.date()])
    .transform((val) => (val instanceof Date ? val.toISOString() : val)),
  updated_at: z
    .union([z.string(), z.date()])
    .transform((val) => (val instanceof Date ? val.toISOString() : val)),
  team_pokemon: z.array(TeamPokemonResponseSchema).optional(),
});

export const TeamsListResponseSchema = z.object({
  teams: z.array(TeamResponseSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

export class TeamPokemonResponseDto extends createZodDto(
  TeamPokemonResponseSchema,
) {}
export class TeamResponseDto extends createZodDto(TeamResponseSchema) {}
export class TeamsListResponseDto extends createZodDto(
  TeamsListResponseSchema,
) {}
