import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto, GetTeamsQueryDto } from './dto';
import {
  createMockTeam,
  createMockTeamPokemon,
} from '../test/fixtures/team.fixture';

describe('TeamsController', () => {
  let controller: TeamsController;
  let teamsService: jest.Mocked<TeamsService>;

  const mockAuthUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: {},
  };

  const mockTeam = createMockTeam({
    id: 'team-123',
    user_id: mockAuthUser.id,
    name: 'Test Team',
    description: 'Test Description',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  });

  const mockTeamPokemon = createMockTeamPokemon({
    pokemon_id: 25,
    pokemon_name: 'pikachu',
    position: 1,
    created_at: '2024-01-01T00:00:00.000Z',
    team_id: mockTeam.id,
  });

  const mockTeamWithPokemon = {
    ...mockTeam,
    team_pokemon: [mockTeamPokemon],
  };

  beforeEach(async () => {
    const mockTeamsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: mockTeamsService,
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    teamsService = module.get(TeamsService);
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
      ],
    };

    it('should successfully create a team', async () => {
      teamsService.create.mockResolvedValue(mockTeamWithPokemon);

      const result = await controller.create(mockAuthUser, createTeamDto);

      expect(teamsService.create).toHaveBeenCalledWith(
        mockAuthUser.id,
        createTeamDto,
      );
      expect(result).toEqual(mockTeamWithPokemon);
    });

    it('should throw BadRequestException for duplicate positions', async () => {
      const duplicatePositionError = new Error(
        'Duplicate position values are not allowed',
      );
      teamsService.create.mockRejectedValue(duplicatePositionError);

      await expect(
        controller.create(mockAuthUser, createTeamDto),
      ).rejects.toThrow(
        new BadRequestException('Duplicate position values are not allowed'),
      );

      expect(teamsService.create).toHaveBeenCalledWith(
        mockAuthUser.id,
        createTeamDto,
      );
    });

    it('should re-throw other errors', async () => {
      const otherError = new Error('Database connection failed');
      teamsService.create.mockRejectedValue(otherError);

      await expect(
        controller.create(mockAuthUser, createTeamDto),
      ).rejects.toThrow(otherError);
    });
  });

  describe('findAll', () => {
    const queryDto: GetTeamsQueryDto = {
      limit: 10,
      offset: 0,
      includePokemons: true,
    };

    it('should successfully return teams list', async () => {
      const mockResult = {
        teams: [mockTeamWithPokemon],
        total: 1,
        limit: queryDto.limit,
        offset: queryDto.offset,
      };

      teamsService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockAuthUser, queryDto);

      expect(teamsService.findAll).toHaveBeenCalledWith(
        mockAuthUser.id,
        queryDto,
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw BadRequestException for invalid pagination parameters', async () => {
      const paginationError = new Error('Invalid pagination parameters');
      teamsService.findAll.mockRejectedValue(paginationError);

      await expect(controller.findAll(mockAuthUser, queryDto)).rejects.toThrow(
        new BadRequestException(
          'Invalid pagination parameters. Ensure limit is between 1 and 100.',
        ),
      );
    });

    it('should re-throw other errors', async () => {
      const otherError = new Error('Database connection failed');
      teamsService.findAll.mockRejectedValue(otherError);

      await expect(controller.findAll(mockAuthUser, queryDto)).rejects.toThrow(
        otherError,
      );
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

    const teamId = 'team-123';

    it('should successfully update a team', async () => {
      const updatedTeam = {
        ...mockTeamWithPokemon,
        name: updateTeamDto.name!,
        description: updateTeamDto.description!,
      };

      teamsService.update.mockResolvedValue(updatedTeam);

      const result = await controller.update(
        mockAuthUser,
        teamId,
        updateTeamDto,
      );

      expect(teamsService.update).toHaveBeenCalledWith(
        teamId,
        mockAuthUser.id,
        updateTeamDto,
      );
      expect(result).toEqual(updatedTeam);
    });

    it('should throw BadRequestException for duplicate positions', async () => {
      const duplicatePositionError = new Error(
        'Duplicate position values are not allowed',
      );
      teamsService.update.mockRejectedValue(duplicatePositionError);

      await expect(
        controller.update(mockAuthUser, teamId, updateTeamDto),
      ).rejects.toThrow(
        new BadRequestException('Duplicate position values are not allowed'),
      );

      expect(teamsService.update).toHaveBeenCalledWith(
        teamId,
        mockAuthUser.id,
        updateTeamDto,
      );
    });

    it('should re-throw NotFoundException when team is not found', async () => {
      const notFoundError = new NotFoundException('Team not found');
      teamsService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update(mockAuthUser, teamId, updateTeamDto),
      ).rejects.toThrow(notFoundError);
    });

    it('should re-throw other errors', async () => {
      const otherError = new Error('Database connection failed');
      teamsService.update.mockRejectedValue(otherError);

      await expect(
        controller.update(mockAuthUser, teamId, updateTeamDto),
      ).rejects.toThrow(otherError);
    });
  });

  describe('remove', () => {
    const teamId = 'team-123';

    it('should successfully delete a team', async () => {
      teamsService.remove.mockResolvedValue();

      await controller.remove(mockAuthUser, teamId);

      expect(teamsService.remove).toHaveBeenCalledWith(teamId, mockAuthUser.id);
    });

    it('should throw NotFoundException when team is not found', async () => {
      const notFoundError = new NotFoundException('Team not found');
      teamsService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove(mockAuthUser, teamId)).rejects.toThrow(
        notFoundError,
      );

      expect(teamsService.remove).toHaveBeenCalledWith(teamId, mockAuthUser.id);
    });

    it('should re-throw other errors', async () => {
      const otherError = new Error('Database connection failed');
      teamsService.remove.mockRejectedValue(otherError);

      await expect(controller.remove(mockAuthUser, teamId)).rejects.toThrow(
        otherError,
      );
    });
  });
});
