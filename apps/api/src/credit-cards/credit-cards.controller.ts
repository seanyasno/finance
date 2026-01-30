import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreditCardsService } from './credit-cards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/auth.decorator';
import { CreditCardsResponseDto } from './dto';

@ApiTags('Credit Cards')
@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all credit cards for the authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credit cards retrieved successfully',
    type: CreditCardsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - authentication required',
  })
  async findAll(
    @CurrentUser() user: AuthUser,
  ): Promise<CreditCardsResponseDto> {
    const creditCards = await this.creditCardsService.findAll(user.id);

    return { creditCards };
  }
}
