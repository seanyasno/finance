export const createMockTeam = (overrides = {}) => ({
  id: 'mock-team-id',
  name: 'Test Team',
  description: 'Test Description',
  user_id: 'mock-user-id',
  created_at: new Date('2024-01-01T00:00:00.000Z'),
  updated_at: new Date('2024-01-01T00:00:00.000Z'),
  team_pokemon: [],
  ...overrides,
});

export const createMockTeamPokemon = (overrides = {}) => ({
  id: 'mock-team-pokemon-id',
  team_id: 'mock-team-id',
  pokemon_id: 25,
  pokemon_name: 'pikachu',
  nickname: 'Sparky',
  position: 1,
  created_at: new Date('2024-01-01T00:00:00.000Z'),
  ...overrides,
});

export const mockTeam = createMockTeam();
export const mockTeamPokemon = createMockTeamPokemon();
