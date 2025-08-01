import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import {
  CreateTeamDto,
  UpdateTeamDto,
  GetTeamsQueryDto,
  TeamResponseDto,
  TeamsListResponseDto,
  TeamResponseSchema,
  TeamsListResponseSchema,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/auth.decorator';

@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Pokemon team' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Team created successfully',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - validation errors or duplicate positions',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() createTeamDto: CreateTeamDto,
  ): Promise<TeamResponseDto> {
    try {
      const team = await this.teamsService.create(user.id, createTeamDto);

      return TeamResponseSchema.parse(team);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Duplicate position')
      ) {
        throw new BadRequestException(
          'Duplicate position values are not allowed',
        );
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: "Get user's Pokemon teams" })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of teams to return (default: 20, max: 100)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Pagination offset (default: 0)',
  })
  @ApiQuery({
    name: 'includePokemons',
    required: false,
    type: Boolean,
    description: 'Include team Pokemon in response (default: true)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teams retrieved successfully',
    type: TeamsListResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: GetTeamsQueryDto,
  ): Promise<TeamsListResponseDto> {
    try {
      const result = await this.teamsService.findAll(user.id, query);

      return TeamsListResponseSchema.parse(result);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Invalid pagination parameters')
      ) {
        throw new BadRequestException(
          'Invalid pagination parameters. Ensure limit is between 1 and 100.',
        );
      }
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Pokemon team' })
  @ApiParam({ name: 'id', description: 'Team ID', type: String })
  @ApiBody({ type: UpdateTeamDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team updated successfully',
    type: TeamResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - validation errors or duplicate positions',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - user doesn't own the team",
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Team not found' })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<TeamResponseDto> {
    try {
      const team = await this.teamsService.update(id, user.id, updateTeamDto);

      return TeamResponseSchema.parse(team);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Duplicate position')
      ) {
        throw new BadRequestException(
          'Duplicate position values are not allowed',
        );
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a Pokemon team' })
  @ApiParam({ name: 'id', description: 'Team ID', type: String })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Team deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - user doesn't own the team",
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Team not found' })
  async remove(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<void> {
    await this.teamsService.remove(id, user.id);
  }
}
