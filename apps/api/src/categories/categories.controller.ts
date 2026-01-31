import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/auth.decorator';
import { CreateCategoryDto, CategoryDto, CategoriesResponseDto } from './dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories (defaults + user custom)', operationId: 'getCategories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories retrieved successfully',
    type: CategoriesResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - authentication required',
  })
  async findAll(@CurrentUser() user: AuthUser): Promise<CategoriesResponseDto> {
    const categories = await this.categoriesService.findAll(user.id);
    return { categories };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a custom category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully',
    type: CategoryDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoriesService.create(user.id, createCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a custom category' })
  @ApiParam({
    name: 'id',
    description: 'Category UUID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Category deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Cannot delete default categories or another user's category",
  })
  async delete(
    @CurrentUser() user: AuthUser,
    @Param('id') categoryId: string,
  ): Promise<void> {
    await this.categoriesService.delete(user.id, categoryId);
  }
}
