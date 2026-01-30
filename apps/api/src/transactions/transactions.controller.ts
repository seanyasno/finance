import { Controller, Get, Query, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/auth.decorator';
import { TransactionQueryDto, TransactionsResponseDto } from './dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transactions with optional filters' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter transactions from this date (ISO 8601 format)',
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter transactions until this date (ISO 8601 format)',
    type: String,
  })
  @ApiQuery({
    name: 'creditCardId',
    required: false,
    description: 'Filter transactions by credit card UUID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transactions retrieved successfully',
    type: TransactionsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - authentication required',
  })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: TransactionQueryDto,
  ): Promise<TransactionsResponseDto> {
    const transactions = await this.transactionsService.findAll(user.id, query);

    return { transactions };
  }
}
