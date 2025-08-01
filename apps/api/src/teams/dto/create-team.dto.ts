import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const TeamPokemonSchema = z.object({
  pokemon_id: z.number().int().positive(),
  pokemon_name: z.string().min(1),
  nickname: z.string().optional(),
  position: z.number().int().min(1).max(6),
});

export const CreateTeamSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  pokemon: z.array(TeamPokemonSchema).max(6).default([]),
});

export class CreateTeamDto extends createZodDto(CreateTeamSchema) {}
export class TeamPokemonDto extends createZodDto(TeamPokemonSchema) {}
