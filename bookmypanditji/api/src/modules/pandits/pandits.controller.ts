import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { PanditsService } from './pandits.service';
import { CreatePanditProfileDto } from './dto/create-pandit-profile.dto';
import { UpdatePanditProfileDto } from './dto/update-pandit-profile.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { PanditSearchDto } from './dto/pandit-search.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role, VerificationStatus } from '@prisma/client';

@ApiTags('Pandits')
@Controller('pandits')
export class PanditsController {
  constructor(private panditsService: PanditsService) {}

  // Public endpoints
  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search pandits' })
  @ApiResponse({ status: 200, description: 'Paginated pandits' })
  async search(@Query() dto: PanditSearchDto) {
    return this.panditsService.searchPandits(dto);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured pandits' })
  @ApiResponse({ status: 200, description: 'Featured pandits' })
  async getFeatured(@Query('limit') limit = 6) {
    return this.panditsService.getFeaturedPandits(Number(limit));
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get pandit profile by ID' })
  @ApiResponse({ status: 200, description: 'Pandit profile' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getProfile(@Param('id') id: string) {
    return this.panditsService.getProfile(id);
  }

  // Authenticated endpoints (Pandit)
  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create pandit profile' })
  @ApiResponse({ status: 201, description: 'Profile created' })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  async createProfile(@CurrentUser('id') userId: string, @Body() dto: CreatePanditProfileDto) {
    return this.panditsService.createProfile(userId, dto);
  }

  @Get('me/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my pandit profile' })
  @ApiResponse({ status: 200, description: 'Pandit profile' })
  async getMyProfile(@CurrentUser('id') userId: string) {
    return this.panditsService.getProfileByUserId(userId);
  }

  @Put('me/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my pandit profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateMyProfile(@CurrentUser('id') userId: string, @Body() dto: UpdatePanditProfileDto) {
    const profile = await this.panditsService.getProfileByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    return this.panditsService.updateProfile(profile.id, userId, dto);
  }

  @Put('me/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update availability' })
  @ApiResponse({ status: 200, description: 'Availability updated' })
  async updateAvailability(@CurrentUser('id') userId: string, @Body() dto: UpdateAvailabilityDto) {
    const profile = await this.panditsService.getProfileByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    return this.panditsService.updateAvailability(profile.id, userId, dto);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pandit stats' })
  @ApiResponse({ status: 200, description: 'Pandit statistics' })
  async getStats(@CurrentUser('id') userId: string) {
    const profile = await this.panditsService.getProfileByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    return this.panditsService.getPanditStats(profile.id);
  }

  @Get('me/earnings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get earnings' })
  @ApiQuery({ name: 'period', enum: ['week', 'month', 'year'], required: false })
  @ApiResponse({ status: 200, description: 'Earnings data' })
  async getEarnings(@CurrentUser('id') userId: string, @Query('period') period: 'week' | 'month' | 'year' = 'month') {
    const profile = await this.panditsService.getProfileByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    return this.panditsService.getEarnings(profile.id, period);
  }

  // Admin endpoints
  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending verifications (Admin)' })
  @ApiResponse({ status: 200, description: 'Pending pandits' })
  async getPendingVerifications(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.panditsService.getPendingVerifications(Number(page), Number(limit));
  }

  @Put('admin/:id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify/reject pandit (Admin)' })
  @ApiResponse({ status: 200, description: 'Verification updated' })
  async verifyPandit(
    @Param('id') panditId: string,
    @CurrentUser('id') adminId: string,
    @Body() body: { status: VerificationStatus; rejectionReason?: string },
  ) {
    return this.panditsService.verifyPandit(panditId, adminId, body.status, body.rejectionReason);
  }
}