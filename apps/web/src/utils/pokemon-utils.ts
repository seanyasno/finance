import { capitalize } from "@poke-playbook/libs";

export function formatHeight(height: number): string {
  return `${(height / 10).toFixed(1)}m`;
}

export function formatWeight(weight: number): string {
  return `${(weight / 10).toFixed(1)}kg`;
}

export function formatStatName(name: string): string {
  const statNames: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp.Attack",
    "special-defense": "Sp.Defense",
    speed: "Speed",
  };

  return statNames[name] ?? capitalize(name);
}
