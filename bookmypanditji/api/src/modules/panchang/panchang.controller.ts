import { Controller, Get, Post, Query, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { PanchangService } from './panchang.service';
import { CreatePanchangDto } from './dto/create-panchang.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('Panchang')
@Controller('panchang')
export class PanchangController {
  constructor(private panchangService: PanchangService) {}

  @Get('today')
  @Public()
  @ApiOperation({ summary: 'Get today\'s panchang' })
  @ApiResponse({ status: 200, description: 'Today\'s panchang' })
  async getToday() {
    return this.panchangService.getTodaysPanchang();
  }

  @Get('date/:date')
  @Public()
  @ApiOperation({ summary: 'Get panchang for specific date' })
  @ApiResponse({ status: 200, description: 'Panchang for date' })
  async getByDate(@Param('date') date: string) {
    return this.panchangService.findByDate(date);
  }

  @Get('range')
  @Public()
  @ApiOperation({ summary: 'Get panchang for date range' })
  @ApiQuery({ name: 'fromDate', type: String })
  @ApiQuery({ name: 'toDate', type: String })
  @ApiResponse({ status: 200, description: 'Panchang range' })
  async getRange(@Query('fromDate') fromDate: string, @Query('toDate') toDate: string) {
    return this.panchangService.getRange(fromDate, toDate);
  }

  @Get('month/:year/:month')
  @Public()
  @ApiOperation({ summary: 'Get panchang for month' })
  @ApiResponse({ status: 200, description: 'Monthly panchang' })
  async getMonth(@Param('year') year: number, @Param('month') month: number) {
    return this.panchangService.getMonth(year, month);
  }

  @Get('festivals/upcoming')
  @Public()
  @ApiOperation({ summary: 'Get upcoming festivals' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Upcoming festivals' })
  async getUpcomingFestivals(@Query('days') days = 30) {
    return this.panchangService.getUpcomingFestivals(Number(days));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create panchang entry (Admin)' })
  @ApiResponse({ status: 201, description: 'Panchang entry created' })
  async create(@Body() dto: CreatePanchangDto) {
    return this.panchangService.create(dto);
  }

  @Post('generate/:year')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate panchang for year (Admin)' })
  @ApiResponse({ status: 200, description: 'Panchang generated' })
  async generateYear(@Param('year') year: number) {
    return this.panchangService.generateForYear(year);
  }
}