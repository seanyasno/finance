import { z } from "zod";
import { TeamSchema } from "./team-schema.ts";

export const TeamsListSchema = z.object({
  teams: z.array(TeamSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

export type TeamsList = z.infer<typeof TeamsListSchema>;
