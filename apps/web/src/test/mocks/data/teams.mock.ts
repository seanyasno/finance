import type { Team, TeamPokemon } from "@/features";

export const mockTeamPokemon: TeamPokemon[] = [
  {
    id: "team-pokemon-1",
    pokemon_id: 25,
    pokemon_name: "pikachu",
    nickname: "Sparky",
    position: 1,
    created_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "team-pokemon-2",
    pokemon_id: 6,
    pokemon_name: "charizard",
    nickname: null,
    position: 2,
    created_at: "2024-01-01T00:00:00.000Z",
  },
];

export const mockTeam: Team = {
  id: "team-1",
  name: "My Test Team",
  description: "A test team for unit tests",
  user_id: "user-1",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  team_pokemon: mockTeamPokemon,
};

export const mockTeams: Team[] = [
  mockTeam,
  {
    id: "team-2",
    name: "Another Team",
    description: "Another test team",
    user_id: "user-1",
    created_at: "2024-01-02T00:00:00.000Z",
    updated_at: "2024-01-02T00:00:00.000Z",
    team_pokemon: [],
  },
];

export const createMockTeam = (overrides: Partial<Team> = {}): Team => ({
  id: "mock-team-id",
  name: "Mock Team",
  description: "Mock team description",
  user_id: "mock-user-id",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  team_pokemon: [],
  ...overrides,
});
