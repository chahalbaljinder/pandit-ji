import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingSearchDto } from './dto/booking-search.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role, BookingStatus } from '@prisma/client';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my bookings' })
  @ApiResponse({ status: 200, description: 'Paginated bookings' })
  async getMyBookings(@CurrentUser('id') userId: string, @Query() dto: BookingSearchDto) {
    return this.bookingsService.getUserBookings(userId, dto);
  }

  @Get('me/upcoming')
  @ApiOperation({ summary: 'Get upcoming bookings' })
  @ApiResponse({ status: 200, description: 'Upcoming bookings' })
  async getUpcoming(@CurrentUser('id') userId: string, @Query('limit') limit = 5) {
    return this.bookingsService.getUpcomingBookings(userId, Number(limit));
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Get booking stats' })
  @ApiResponse({ status: 200, description: 'Booking statistics' })
  async getStats(@CurrentUser('id') userId: string) {
    return this.bookingsService.getBookingStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findById(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.bookingsService.findById(id, userId);
  }

  @Get('number/:bookingNumber')
  @ApiOperation({ summary: 'Get booking by booking number' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findByBookingNumber(@Param('bookingNumber') bookingNumber: string) {
    return this.bookingsService.findByBookingNumber(bookingNumber);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update booking' })
  @ApiResponse({ status: 200, description: 'Booking updated' })
  async update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, userId, dto);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled' })
  async cancel(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() body: { reason: string }) {
    return this.bookingsService.cancel(id, userId, body.reason);
  }

  // Pandit endpoints
  @Get('pandit/me')
  @ApiOperation({ summary: 'Get my pandit bookings' })
  @ApiResponse({ status: 200, description: 'Paginated bookings' })
  async getPanditBookings(@CurrentUser('id') userId: string, @Query() dto: BookingSearchDto) {
    const pandit = await this.bookingsService['prisma'].pandit.findUnique({ where: { userId } });
    if (!pandit) throw new Error('Pandit profile not found');
    return this.bookingsService.getPanditBookings(pandit.id, dto);
  }

  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm booking (Pandit)' })
  @ApiResponse({ status: 200, description: 'Booking confirmed' })
  async confirm(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const pandit = await this.bookingsService['prisma'].pandit.findUnique({ where: { userId } });
    if (!pandit) throw new Error('Pandit profile not found');
    return this.bookingsService.confirm(id, pandit.id);
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start service (Pandit)' })
  @ApiResponse({ status: 200, description: 'Service started' })
  async start(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const pandit = await this.bookingsService['prisma'].pandit.findUnique({ where: { userId } });
    if (!pandit) throw new Error('Pandit profile not found');
    return this.bookingsService.start(id, pandit.id);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete service (Pandit)' })
  @ApiResponse({ status: 200, description: 'Service completed' })
  async complete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const pandit = await this.bookingsService['prisma'].pandit.findUnique({ where: { userId } });
    if (!pandit) throw new Error('Pandit profile not found');
    return this.bookingsService.complete(id, pandit.id);
  }

  // Admin endpoints
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all bookings (Admin)' })
  @ApiResponse({ status: 200, description: 'Paginated bookings' })
  async findAll(@Query() dto: BookingSearchDto) {
    return this.bookingsService.searchBookings(dto);
  }

  @Put('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update booking status (Admin)' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(@Param('id') id: string, @Body() body: { status: BookingStatus }) {
    return this.bookingsService['prisma'].booking.update({
      where: { id },
      data: { status: body.status },
    });
  }
}