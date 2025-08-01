interface EvolutionSpecies {
  name: string;
  url: string;
}

interface Evolution {
  species: EvolutionSpecies;
  evolves_to?: Evolution[];
}

export function flattenEvolutionChain(
  chain: Evolution,
): Array<{ name: string; id: string }> {
  const result: Array<{ name: string; id: string }> = [];

  const processEvolution = (evolution: Evolution) => {
    if (evolution?.species) {
      const match = evolution.species.url.match(/\/(\d+)\/$/);
      const id = match?.[1] ?? "1";

      result.push({
        name: evolution.species.name,
        id,
      });
    }

    if (evolution?.evolves_to && evolution.evolves_to.length > 0) {
      processEvolution(evolution.evolves_to[0]);
    }
  };

  processEvolution(chain);
  return result;
}
