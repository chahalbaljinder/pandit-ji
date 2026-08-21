import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('analytics/revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  @ApiQuery({ name: 'period', enum: ['day', 'week', 'month', 'year'], required: false })
  @ApiResponse({ status: 200, description: 'Revenue analytics' })
  async getRevenue(@Query('period') period: 'day' | 'week' | 'month' | 'year' = 'month') {
    return this.adminService.getRevenueAnalytics(period);
  }

  @Get('analytics/user-growth')
  @ApiOperation({ summary: 'Get user growth analytics' })
  @ApiQuery({ name: 'period', enum: ['week', 'month', 'year'], required: false })
  @ApiResponse({ status: 200, description: 'User growth' })
  async getUserGrowth(@Query('period') period: 'week' | 'month' | 'year' = 'month') {
    return this.adminService.getUserGrowth(period);
  }

  @Get('analytics/booking-trends')
  @ApiOperation({ summary: 'Get booking trends' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Booking trends' })
  async getBookingTrends(@Query('days') days = 30) {
    return this.adminService.getBookingTrends(Number(days));
  }

  @Get('top-pandits')
  @ApiOperation({ summary: 'Get top performing pandits' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Top pandits' })
  async getTopPandits(@Query('limit') limit = 10) {
    return this.adminService.getTopPandits(Number(limit));
  }

  @Get('popular-services')
  @ApiOperation({ summary: 'Get popular services' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Popular services' })
  async getPopularServices(@Query('limit') limit = 10) {
    return this.adminService.getPopularServices(Number(limit));
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Audit logs' })
  async getAuditLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
  ) {
    return this.adminService.getAuditLogs({ page: Number(page), limit: Number(limit), userId, action });
  }
}