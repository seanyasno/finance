import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpStatus,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/auth.decorator';
import {
  TransactionQueryDto,
  TransactionsResponseDto,
  UpdateTransactionDto,
  TransactionDto,
} from './dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transactions with optional filters', operationId: 'getTransactions' })
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
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search transactions by merchant name or notes',
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update transaction category or notes', operationId: 'updateTransaction' })
  @ApiParam({ name: 'id', description: 'Transaction UUID' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction updated successfully',
    type: TransactionDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid category',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - authentication required',
  })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() updateDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.update(user.id, id, updateDto);
  }
}
