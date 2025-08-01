import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto, GetTeamsQueryDto } from './dto';
import {
  createMockTeam,
  createMockTeamPokemon,
} from '../test/fixtures/team.fixture';

// Mock the database module
jest.mock('@poke-playbook/database', () => ({
  db: {
    $transaction: jest.fn(),
    teams: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    team_pokemon: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

import { db } from '@poke-playbook/database';

describe('TeamsService', () => {
  let service: TeamsService;
  const mockDb = db as jest.Mocked<typeof db>;

  const userId = 'user-123';
  const teamId = 'team-123';

  const mockTeam = createMockTeam({
    id: teamId,
    user_id: userId,
    name: 'Test Team',
    description: 'Test Description',
  });

  const mockTeamPokemon = createMockTeamPokemon({
    team_id: teamId,
    pokemon_id: 25,
    pokemon_name: 'pikachu',
    position: 1,
  });

  const mockTeamWithPokemon = {
    ...mockTeam,
    team_pokemon: [mockTeamPokemon],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamsService],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createTeamDto: CreateTeamDto = {
      name: 'Test Team',
      description: 'Test Description',
      pokemon: [
        {
          pokemon_id: 25,
          pokemon_name: 'pikachu',
          nickname: 'Sparky',
          position: 1,
        },
        {
          pokemon_id: 6,
          pokemon_name: 'charizard',
          nickname: undefined,
          position: 2,
        },
      ],
    };

    it('should successfully create a team with pokemon', async () => {
      const mockTransactionContext = {
        teams: {
          create: jest.fn().mockResolvedValue(mockTeam),
          findUnique: jest.fn().mockResolvedValue(mockTeamWithPokemon),
        },
        team_pokemon: {
          createMany: jest.fn().mockResolvedValue({ count: 2 }),
        },
      };

      mockDb.$transaction.mockImplementation(async (callback) => {
        return callback(mockTransactionContext as any);
      });

      const result = await service.create(userId, createTeamDto);

      expect(mockTransactionContext.teams.create).toHaveBeenCalledWith({
        data: {
          name: createTeamDto.name,
          description: createTeamDto.description,
          user_id: userId,
        },
      });

      expect(
        mockTransactionContext.team_pokemon.createMany,
      ).toHaveBeenCalledWith({
        data: createTeamDto.pokemon.map((pokemon) => ({
          team_id: mockTeam.id,
          pokemon_id: pokemon.pokemon_id,
          pokemon_name: pokemon.pokemon_name,
          nickname: pokemon.nickname,
          position: pokemon.position,
        })),
      });

      expect(result).toEqual(mockTeamWithPokemon);
    });

    it('should create a team without pokemon', async () => {
      const createTeamDtoWithoutPokemon: CreateTeamDto = {
        name: 'Empty Team',
        description: 'Team without pokemon',
        pokemon: [],
      };

      const mockTransactionContext = {
        teams: {
          create: jest.fn().mockResolvedValue(mockTeam),
          findUnique: jest.fn().mockResolvedValue(mockTeam),
        },
        team_pokemon: {
          createMany: jest.fn(),
        },
      };

      mockDb.$transaction.mockImplementation(async (callback) => {
        return callback(mockTransactionContext as any);
      });

      const result = await service.create(userId, createTeamDtoWithoutPokemon);

      expect(mockTransactionContext.teams.create).toHaveBeenCalled();
      expect(
        mockTransactionContext.team_pokemon.createMany,
      ).not.toHaveBeenCalled();
      expect(result).toEqual(mockTeam);
    });

    it('should throw error when duplicate positions are provided', async () => {
      const createTeamDtoWithDuplicates: CreateTeamDto = {
        name: 'Test Team',
        description: 'Test Description',
        pokemon: [
          {
            pokemon_id: 25,
            pokemon_name: 'pikachu',
            nickname: 'Sparky',
            position: 1,
          },
          {
            pokemon_id: 6,
            pokemon_name: 'charizard',
            nickname: undefined,
            position: 1, // Duplicate position
          },
        ],
      };

      await expect(
        service.create(userId, createTeamDtoWithDuplicates),
      ).rejects.toThrow('Duplicate position values are not allowed');

      expect(mockDb.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const queryDto: GetTeamsQueryDto = {
      limit: 10,
      offset: 0,
      includePokemons: true,
    };

    it('should return teams with pokemon when includePokemons is true', async () => {
      const mockTeams = [mockTeamWithPokemon];
      const mockTotal = 1;

      (mockDb.teams.findMany as jest.Mock).mockResolvedValue(mockTeams);
      (mockDb.teams.count as jest.Mock).mockResolvedValue(mockTotal);

      const result = await service.findAll(userId, queryDto);

      expect(mockDb.teams.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: {
          team_pokemon: {
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { created_at: 'desc' },
        take: queryDto.limit,
        skip: queryDto.offset,
      });

      expect(mockDb.teams.count).toHaveBeenCalledWith({
        where: { user_id: userId },
      });

      expect(result).toEqual({
        teams: mockTeams,
        total: mockTotal,
        limit: queryDto.limit,
        offset: queryDto.offset,
      });
    });

    it('should return teams without pokemon when includePokemons is false', async () => {
      const queryDtoWithoutPokemon: GetTeamsQueryDto = {
        limit: 10,
        offset: 0,
        includePokemons: false,
      };

      const mockTeams = [mockTeam];
      const mockTotal = 1;

      (mockDb.teams.findMany as jest.Mock).mockResolvedValue(mockTeams);
      (mockDb.teams.count as jest.Mock).mockResolvedValue(mockTotal);

      const result = await service.findAll(userId, queryDtoWithoutPokemon);

      expect(mockDb.teams.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: {
          team_pokemon: false,
        },
        orderBy: { created_at: 'desc' },
        take: queryDtoWithoutPokemon.limit,
        skip: queryDtoWithoutPokemon.offset,
      });

      expect(result).toEqual({
        teams: mockTeams,
        total: mockTotal,
        limit: queryDtoWithoutPokemon.limit,
        offset: queryDtoWithoutPokemon.offset,
      });
    });
  });

  describe('findOne', () => {
    it('should return a team when found', async () => {
      (mockDb.teams.findFirst as jest.Mock).mockResolvedValue(
        mockTeamWithPokemon,
      );

      const result = await service.findOne(teamId, userId);

      expect(mockDb.teams.findFirst).toHaveBeenCalledWith({
        where: { id: teamId, user_id: userId },
        include: {
          team_pokemon: {
            orderBy: { position: 'asc' },
          },
        },
      });

      expect(result).toEqual(mockTeamWithPokemon);
    });

    it('should throw NotFoundException when team is not found', async () => {
      (mockDb.teams.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(teamId, userId)).rejects.toThrow(
        new NotFoundException('Team not found'),
      );

      expect(mockDb.teams.findFirst).toHaveBeenCalledWith({
        where: { id: teamId, user_id: userId },
        include: {
          team_pokemon: {
            orderBy: { position: 'asc' },
          },
        },
      });
    });

    it('should throw NotFoundException when team belongs to different user', async () => {
      (mockDb.teams.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        service.findOne(teamId, 'different-user-id'),
      ).rejects.toThrow(new NotFoundException('Team not found'));
    });
  });

  describe('update', () => {
    const updateTeamDto: UpdateTeamDto = {
      name: 'Updated Team Name',
      description: 'Updated Description',
      pokemon: [
        {
          pokemon_id: 150,
          pokemon_name: 'mewtwo',
          nickname: 'Psychic Cat',
          position: 1,
        },
      ],
    };

    it('should successfully update a team', async () => {
      const mockTransactionContext = {
        teams: {
          update: jest.fn().mockResolvedValue(mockTeam),
          findUnique: jest.fn().mockResolvedValue(mockTeamWithPokemon),
        },
        team_pokemon: {
          deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
          createMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
      };

      // Mock findOne to pass authorization check
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTeamWithPokemon);

      mockDb.$transaction.mockImplementation(async (callback) => {
        return callback(mockTransactionContext as any);
      });

      const result = await service.update(teamId, userId, updateTeamDto);

      expect(service.findOne).toHaveBeenCalledWith(teamId, userId);

      expect(mockTransactionContext.teams.update).toHaveBeenCalledWith({
        where: { id: teamId },
        data: {
          name: updateTeamDto.name,
          description: updateTeamDto.description,
          updated_at: expect.any(Date),
        },
      });

      expect(
        mockTransactionContext.team_pokemon.deleteMany,
      ).toHaveBeenCalledWith({
        where: { team_id: teamId },
      });

      expect(
        mockTransactionContext.team_pokemon.createMany,
      ).toHaveBeenCalledWith({
        data: updateTeamDto.pokemon!.map((pokemon) => ({
          team_id: teamId,
          pokemon_id: pokemon.pokemon_id,
          pokemon_name: pokemon.pokemon_name,
          nickname: pokemon.nickname,
          position: pokemon.position,
        })),
      });

      expect(result).toEqual(mockTeamWithPokemon);
    });

    it('should update team without changing pokemon when pokemon is not provided', async () => {
      const updateTeamDtoWithoutPokemon: UpdateTeamDto = {
        name: 'Updated Team Name',
        description: 'Updated Description',
      };

      const mockTransactionContext = {
        teams: {
          update: jest.fn().mockResolvedValue(mockTeam),
          findUnique: jest.fn().mockResolvedValue(mockTeamWithPokemon),
        },
        team_pokemon: {
          deleteMany: jest.fn(),
          createMany: jest.fn(),
        },
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTeamWithPokemon);

      mockDb.$transaction.mockImplementation(async (callback) => {
        return callback(mockTransactionContext as any);
      });

      const result = await service.update(
        teamId,
        userId,
        updateTeamDtoWithoutPokemon,
      );

      expect(mockTransactionContext.teams.update).toHaveBeenCalled();
      expect(
        mockTransactionContext.team_pokemon.deleteMany,
      ).not.toHaveBeenCalled();
      expect(
        mockTransactionContext.team_pokemon.createMany,
      ).not.toHaveBeenCalled();

      expect(result).toEqual(mockTeamWithPokemon);
    });

    it('should throw error when duplicate positions are provided in update', async () => {
      const updateTeamDtoWithDuplicates: UpdateTeamDto = {
        name: 'Updated Team',
        pokemon: [
          {
            pokemon_id: 25,
            pokemon_name: 'pikachu',
            nickname: 'Sparky',
            position: 1,
          },
          {
            pokemon_id: 6,
            pokemon_name: 'charizard',
            nickname: undefined,
            position: 1, // Duplicate position
          },
        ],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTeamWithPokemon);

      await expect(
        service.update(teamId, userId, updateTeamDtoWithDuplicates),
      ).rejects.toThrow('Duplicate position values are not allowed');

      expect(mockDb.$transaction).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when team to update is not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Team not found'));

      await expect(
        service.update(teamId, userId, updateTeamDto),
      ).rejects.toThrow(new NotFoundException('Team not found'));

      expect(mockDb.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should successfully delete a team', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTeamWithPokemon);
      (mockDb.teams.delete as jest.Mock).mockResolvedValue(mockTeam);

      await service.remove(teamId, userId);

      expect(service.findOne).toHaveBeenCalledWith(teamId, userId);
      expect(mockDb.teams.delete).toHaveBeenCalledWith({
        where: { id: teamId },
      });
    });

    it('should throw NotFoundException when team to delete is not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Team not found'));

      await expect(service.remove(teamId, userId)).rejects.toThrow(
        new NotFoundException('Team not found'),
      );

      expect(mockDb.teams.delete).not.toHaveBeenCalled();
    });
  });
});
