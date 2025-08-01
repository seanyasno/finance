import { z } from "zod";

export const TeamFormSchema = z.object({
  teamName: z
    .string()
    .min(1, "Team name is required")
    .max(255, "Team name too long"),
  teamDescription: z.string(),
  selectedPokemon: z
    .array(
      z.object({
        pokemon_id: z.number(),
        pokemon_name: z.string(),
        nickname: z.string(),
        position: z.number(),
      }),
    )
    .max(6),
});

export type TeamFormData = z.infer<typeof TeamFormSchema>;
