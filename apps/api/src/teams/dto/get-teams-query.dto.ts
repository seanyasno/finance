import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const GetTeamsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
  includePokemons: z.coerce.boolean().optional().default(true),
});

export class GetTeamsQueryDto extends createZodDto(GetTeamsQuerySchema) {}
