import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { TeamPokemonSchema } from './create-team.dto';

export const UpdateTeamSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  pokemon: z.array(TeamPokemonSchema).max(6).optional(),
});

export class UpdateTeamDto extends createZodDto(UpdateTeamSchema) {}
