import { Controller, Post, Get, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RazorpayWebhookDto } from './dto/razorpay-webhook.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment for booking' })
  @ApiResponse({ status: 201, description: 'Payment created' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto);
  }

  @Post('razorpay/order/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Razorpay order' })
  @ApiResponse({ status: 200, description: 'Razorpay order created' })
  async createRazorpayOrder(@Param('bookingId') bookingId: string) {
    return this.paymentsService.createRazorpayOrder(bookingId);
  }

  @Post('razorpay/webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Razorpay webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async razorpayWebhook(@Body() dto: RazorpayWebhookDto) {
    await this.paymentsService.handleRazorpayWebhook(dto);
    return { success: true };
  }

  @Get('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payments for booking' })
  @ApiResponse({ status: 200, description: 'Payment list' })
  async getByBookingId(@Param('bookingId') bookingId: string) {
    return this.paymentsService.findByBookingId(bookingId);
  }

  @Post('refund/:bookingId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refund payment (Admin)' })
  @ApiResponse({ status: 200, description: 'Refund processed' })
  async refund(@Param('bookingId') bookingId: string, @Body() body: { reason: string }, @CurrentUser('id') adminId: string) {
    return this.paymentsService.refund(bookingId, body.reason, adminId);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment statistics (Admin)' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Payment statistics' })
  async getStats(@Query('fromDate') fromDate?: string, @Query('toDate') toDate?: string) {
    return this.paymentsService.getPaymentStats(fromDate ? new Date(fromDate) : undefined, toDate ? new Date(toDate) : undefined);
  }
}