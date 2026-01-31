import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { SpendingSummaryDto } from './dto';
import { CurrentUser, AuthUser } from '../auth/auth.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('spending-summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get spending summary for last 5 months', operationId: 'getSpendingSummary' })
  @ApiResponse({ status: 200, type: SpendingSummaryDto, description: 'Spending summary with 5-month history, comparisons, and trends' })
  @ApiResponse({ status: 401, description: 'Unauthorized - authentication required' })
  async getSpendingSummary(@CurrentUser() user: AuthUser): Promise<SpendingSummaryDto> {
    return this.statisticsService.getSpendingSummary(user.id);
  }
}
