import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Payment, PaymentStatus, BookingStatus, Prisma } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RazorpayWebhookDto } from './dto/razorpay-webhook.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { user: true, pandit: true, service: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.paymentStatus === PaymentStatus.COMPLETED) throw new BadRequestException('Payment already completed');

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: dto.bookingId,
        userId: booking.userId,
        amount: dto.amount,
        currency: dto.currency || 'INR',
        method: dto.method,
        status: PaymentStatus.PENDING,
        metadata: dto.metadata,
      },
    });

    return payment;
  }

  async createRazorpayOrder(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    // In production, integrate with Razorpay SDK
    // const order = await razorpay.orders.create({
    //   amount: Math.round(Number(booking.totalAmount) * 100), // in paise
    //   currency: 'INR',
    //   receipt: booking.bookingNumber,
    //   notes: { bookingId },
    // });

    // Mock order for development
    const order = {
      id: `order_${Date.now()}`,
      amount: Math.round(Number(booking.totalAmount) * 100),
      currency: 'INR',
      receipt: booking.bookingNumber,
    };

    // Update payment with order ID
    await this.prisma.payment.updateMany({
      where: { bookingId, status: PaymentStatus.PENDING },
      data: { providerOrderId: order.id },
    });

    return { orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID };
  }

  async handleRazorpayWebhook(dto: RazorpayWebhookDto): Promise<void> {
    const { event, payload } = dto;

    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;

      const payment = await this.prisma.payment.findFirst({
        where: { providerOrderId: orderId },
        include: { booking: true },
      });

      if (!payment) {
        this.logger.warn(`Payment not found for order: ${orderId}`);
        return;
      }

      if (payment.status === PaymentStatus.COMPLETED) return;

      await this.prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.COMPLETED,
            providerPaymentId: paymentEntity.id,
            paidAt: new Date(),
            metadata: { ...payment.metadata, razorpay: paymentEntity },
          },
        });

        await tx.booking.update({
          where: { id: payment.bookingId },
          data: { paymentStatus: PaymentStatus.COMPLETED },
        });

        // Create wallet transaction
        await tx.transaction.create({
          data: {
            walletId: (await tx.wallet.findUnique({ where: { userId: payment.userId } }))?.id || '',
            type: 'DEBIT',
            amount: payment.amount,
            balanceAfter: 0, // Will be calculated
            description: `Payment for booking ${payment.booking.bookingNumber}`,
            referenceId: payment.bookingId,
            referenceType: 'BOOKING',
          },
        });
      });

      this.eventEmitter.emit('payment.completed', { paymentId: payment.id, bookingId: payment.bookingId });
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;

      await this.prisma.payment.updateMany({
        where: { providerOrderId: orderId },
        data: {
          status: PaymentStatus.FAILED,
          errorMessage: paymentEntity.error_description,
          metadata: { razorpay: paymentEntity },
        },
      });

      this.eventEmitter.emit('payment.failed', { orderId, error: paymentEntity.error_description });
    }
  }

  async refund(bookingId: string, reason: string, adminId?: string): Promise<Payment> {
    const payment = await this.prisma.payment.findFirst({
      where: { bookingId, status: PaymentStatus.COMPLETED },
      include: { booking: true },
    });

    if (!payment) throw new NotFoundException('No completed payment found for this booking');

    // In production, call Razorpay refund API
    // const refund = await razorpay.payments.refund(payment.providerPaymentId, { amount: Math.round(Number(payment.amount) * 100) });

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.REFUNDED,
        refundedAt: new Date(),
        refundReason: reason,
        metadata: { ...payment.metadata, refund: { reason, adminId, refundedAt: new Date() } },
      },
    });

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: PaymentStatus.REFUNDED, status: BookingStatus.REFUNDED },
    });

    this.eventEmitter.emit('payment.refunded', { paymentId: payment.id, bookingId, reason });
    return updated;
  }

  async findByBookingId(bookingId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({ where: { id } });
  }

  async getPaymentStats(fromDate?: Date, toDate?: Date) {
    const where: Prisma.PaymentWhereInput = { status: PaymentStatus.COMPLETED };
    if (fromDate || toDate) {
      where.paidAt = {};
      if (fromDate) where.paidAt.gte = fromDate;
      if (toDate) where.paidAt.lte = toDate;
    }

    const [totalAmount, totalCount, byMethod] = await Promise.all([
      this.prisma.payment.aggregate({ where, _sum: { amount: true } }),
      this.prisma.payment.count({ where }),
      this.prisma.payment.groupBy({ by: ['method'], where, _sum: { amount: true }, _count: true }),
    ]);

    return {
      totalAmount: totalAmount._sum.amount || 0,
      totalCount,
      byMethod: byMethod.map(m => ({ method: m.method, amount: m._sum.amount || 0, count: m._count })),
    };
  }
}