import { Injectable, NotFoundException } from '@nestjs/common';
import { db, PrismaClient } from '@poke-playbook/database';
import { CreateTeamDto, UpdateTeamDto, GetTeamsQueryDto } from './dto';
import {
  isNotEmptyArray,
  isNotNullOrUndefined,
  isNullOrUndefined,
} from '@poke-playbook/libs';

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

@Injectable()
export class TeamsService {
  async create(userId: string, { name, description, pokemon }: CreateTeamDto) {
    const positions = pokemon.map(({ position }) => position);
    const uniquePositions = new Set(positions);

    if (positions.length !== uniquePositions.size) {
      throw new Error('Duplicate position values are not allowed');
    }

    return db.$transaction(async (transactionContext: TransactionClient) => {
      const team = await transactionContext.teams.create({
        data: {
          name,
          description,
          user_id: userId,
        },
      });

      if (isNotEmptyArray(pokemon)) {
        await transactionContext.team_pokemon.createMany({
          data: pokemon.map((pokemon) => ({
            team_id: team.id,
            pokemon_id: pokemon.pokemon_id,
            pokemon_name: pokemon.pokemon_name,
            nickname: pokemon.nickname,
            position: pokemon.position,
          })),
        });
      }

      return transactionContext.teams.findUnique({
        where: { id: team.id },
        include: {
          team_pokemon: {
            orderBy: { position: 'asc' },
          },
        },
      });
    });
  }

  async findAll(
    userId: string,
    { limit, offset, includePokemons }: GetTeamsQueryDto,
  ) {
    const [teams, total] = await Promise.all([
      db.teams.findMany({
        where: { user_id: userId },
        include: {
          team_pokemon: includePokemons
            ? {
                orderBy: { position: 'asc' },
              }
            : false,
        },
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.teams.count({
        where: { user_id: userId },
      }),
    ]);

    return {
      teams,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string, userId: string) {
    const team = await db.teams.findFirst({
      where: { id, user_id: userId },
      include: {
        team_pokemon: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (isNullOrUndefined(team)) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async update(
    id: string,
    userId: string,
    { name, description, pokemon }: UpdateTeamDto,
  ) {
    await this.findOne(id, userId);

    if (isNotNullOrUndefined(pokemon)) {
      const positions = pokemon.map(({ position }) => position);
      const uniquePositions = new Set(positions);

      if (positions.length !== uniquePositions.size) {
        throw new Error('Duplicate position values are not allowed');
      }
    }

    return db.$transaction(async (transactionContext: TransactionClient) => {
      await transactionContext.teams.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          updated_at: new Date(),
        },
      });

      if (isNotNullOrUndefined(pokemon)) {
        await transactionContext.team_pokemon.deleteMany({
          where: { team_id: id },
        });

        if (isNotEmptyArray(pokemon)) {
          await transactionContext.team_pokemon.createMany({
            data: pokemon.map((pokemon) => ({
              team_id: id,
              pokemon_id: pokemon.pokemon_id,
              pokemon_name: pokemon.pokemon_name,
              nickname: pokemon.nickname,
              position: pokemon.position,
            })),
          });
        }
      }

      return await transactionContext.teams.findUnique({
        where: { id },
        include: {
          team_pokemon: {
            orderBy: { position: 'asc' },
          },
        },
      });
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await db.teams.delete({
      where: { id },
    });
  }
}
