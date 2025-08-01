import { z } from "zod";
import { PokemonTypeSchema } from "./pokemon-type-schema";

export const PokemonDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number(),
  abilities: z.array(
    z.object({
      ability: z.object({
        name: z.string(),
        url: z.string(),
      }),
      is_hidden: z.boolean(),
      slot: z.number(),
    })
  ),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      effort: z.number(),
      stat: z.object({
        name: z.string(),
        url: z.string(),
      }),
    })
  ),
  sprites: z.object({
    front_default: z.string().nullable(),
    front_shiny: z.string().nullable(),
    back_default: z.string().nullable(),
    back_shiny: z.string().nullable(),
    other: z.object({
      "official-artwork": z.object({
        front_default: z.string().nullable(),
        front_shiny: z.string().nullable(),
      }).optional(),
      dream_world: z.object({
        front_default: z.string().nullable(),
        front_female: z.string().nullable(),
      }).optional(),
      home: z.object({
        front_default: z.string().nullable(),
        front_female: z.string().nullable(),
        front_shiny: z.string().nullable(),
        front_shiny_female: z.string().nullable(),
      }).optional(),
    }).optional(),
  }),
  types: z.array(
    z.object({
      slot: z.number(),
      type: z.object({
        name: PokemonTypeSchema,
        url: z.string(),
      }),
    })
  ),
});

export type PokemonDetail = z.infer<typeof PokemonDetailSchema>;
