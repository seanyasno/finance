import { z } from "zod";

export const SearchParamsSchema = z.object({
  search: z.string().optional(),
  types: z.array(z.string()).optional(),
  game: z.string().optional(),
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;
