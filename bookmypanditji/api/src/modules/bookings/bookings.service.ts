import { Injectable, NotFoundException, ForbiddenException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Booking, BookingStatus, PaymentStatus, Prisma, VenueType } from '@prisma/client';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingSearchDto } from './dto/booking-search.dto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  private readonly PLATFORM_FEE_PERCENT = 10; // 10%

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateBookingDto): Promise<Booking> {
    // Validate service
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
      include: { products: true },
    });
    if (!service) throw new NotFoundException('Service not found');

    // Validate pandit if provided
    let pandit = null;
    if (dto.panditId) {
      pandit = await this.prisma.pandit.findUnique({
        where: { id: dto.panditId },
        include: { services: { where: { serviceId: dto.serviceId, isActive: true } } },
      });
      if (!pandit) throw new NotFoundException('Pandit not found');
      if (pandit.verificationStatus !== 'VERIFIED') throw new BadRequestException('Pandit not verified');
      if (!pandit.services.length) throw new BadRequestException('Pandit does not offer this service');
    }

    // Check availability
    if (dto.panditId) {
      const isAvailable = await this.checkAvailability(dto.panditId, dto.bookingDate, dto.startTime, dto.endTime);
      if (!isAvailable) throw new ConflictException('Pandit not available at selected time');
    }

    // Calculate pricing
    const servicePrice = dto.panditId
      ? await this.getPanditServicePrice(dto.panditId, dto.serviceId) || service.basePrice
      : service.basePrice;

    // Calculate samagri price
    let samagriPrice = 0;
    const samagriItems: Array<{ productId: string; quantity: number; unitPrice: any; totalPrice: any }> = [];
    if (dto.samagriItems?.length) {
      for (const item of dto.samagriItems) {
        const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
        if (product.trackInventory && product.stockQuantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }
        const totalPrice = Number(product.price) * item.quantity;
        samagriPrice += totalPrice;
        samagriItems.push({ productId: item.productId, quantity: item.quantity, unitPrice: product.price, totalPrice });
      }
    }

    const platformFee = (Number(servicePrice) + samagriPrice) * (this.PLATFORM_FEE_PERCENT / 100);
    const taxAmount = (Number(servicePrice) + samagriPrice) * 0.18; // 18% GST
    const totalAmount = Number(servicePrice) + samagriPrice + platformFee + taxAmount + (dto.travelCharges || 0);

    // Generate booking number
    const bookingNumber = `BMP${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create booking
    const booking = await this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          userId,
          panditId: dto.panditId,
          serviceId: dto.serviceId,
          bookingDate: new Date(dto.bookingDate),
          startTime: dto.startTime,
          endTime: dto.endTime,
          timezone: dto.timezone || 'Asia/Kolkata',
          venueType: dto.venueType || VenueType.HOME,
          venueAddress: dto.venueAddress,
          venueLatitude: dto.venueLatitude,
          venueLongitude: dto.venueLongitude,
          templeId: dto.templeId,
          landmark: dto.landmark,
          participants: dto.participants || 1,
          specialRequests: dto.specialRequests,
          servicePrice,
          samagriPrice,
          travelCharges: dto.travelCharges || 0,
          platformFee,
          taxAmount,
          totalAmount,
          currency: 'INR',
          status: dto.panditId ? BookingStatus.CONFIRMED : BookingStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          confirmedAt: dto.panditId ? new Date() : null,
          samagriItems: { create: samagriItems },
          timeline: { create: { status: dto.panditId ? BookingStatus.CONFIRMED : BookingStatus.PENDING, note: 'Booking created', createdBy: 'USER' } },
        },
        include: { samagriItems: { include: { product: true } }, user: true, pandit: { include: { user: true } }, service: true },
      });

      // Update pandit stats
      if (dto.panditId) {
        await tx.pandit.update({
          where: { id: dto.panditId },
          data: { totalBookings: { increment: 1 } },
        });
      }

      return booking;
    });

    // Emit events
    this.eventEmitter.emit('booking.created', { bookingId: booking.id, userId, panditId: dto.panditId });
    if (dto.panditId) {
      this.eventEmitter.emit('booking.confirmed', { bookingId: booking.id, panditId: dto.panditId });
    }

    await this.redis.del(`bookings:user:${userId}`);
    if (dto.panditId) await this.redis.del(`bookings:pandit:${dto.panditId}`);

    this.logger.log(`Booking created: ${booking.bookingNumber} by user ${userId}`);
    return booking;
  }

  async findById(id: string, userId?: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        pandit: { include: { user: { select: { id: true, name: true, email: true, phone: true, avatar: true } } } },
        service: true,
        samagriItems: { include: { product: true } },
        payments: true,
        reviews: true,
        timeline: { orderBy: { createdAt: 'asc' } },
        temple: true,
      },
    });

    if (!booking) return null;
    if (userId && booking.userId !== userId && booking.panditId !== userId) {
      throw new ForbiddenException('Not authorized to view this booking');
    }
    return booking;
  }

  async findByBookingNumber(bookingNumber: string): Promise<Booking | null> {
    return this.prisma.booking.findUnique({
      where: { bookingNumber },
      include: { user: true, pandit: { include: { user: true } }, service: true, samagriItems: { include: { product: true } } },
    });
  }

  async update(id: string, userId: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findById(id, userId);
    if (!booking) throw new NotFoundException('Booking not found');

    // Only allow certain updates based on status
    const allowedStatuses: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED];
    if (!allowedStatuses.includes(booking.status)) {
      throw new BadRequestException('Cannot update booking in current status');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        bookingDate: dto.bookingDate ? new Date(dto.bookingDate) : undefined,
        startTime: dto.startTime,
        endTime: dto.endTime,
        venueAddress: dto.venueAddress,
        venueLatitude: dto.venueLatitude,
        venueLongitude: dto.venueLongitude,
        landmark: dto.landmark,
        specialRequests: dto.specialRequests,
      },
      include: { samagriItems: { include: { product: true } }, user: true, pandit: { include: { user: true } }, service: true },
    });

    // Add timeline entry
    await this.prisma.bookingTimeline.create({
      data: { bookingId: id, status: booking.status, note: 'Booking updated', createdBy: 'USER' },
    });

    await this.redis.del(`bookings:user:${userId}`);
    if (booking.panditId) await this.redis.del(`bookings:pandit:${booking.panditId}`);

    return updated;
  }

  async cancel(id: string, userId: string, reason: string): Promise<Booking> {
    const booking = await this.findById(id, userId);
    if (!booking) throw new NotFoundException('Booking not found');

    const cancellableStatuses: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED];
    if (!cancellableStatuses.includes(booking.status)) {
      throw new BadRequestException('Cannot cancel booking in current status');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
        cancellationReason: reason,
        timeline: { create: { status: BookingStatus.CANCELLED, note: reason, createdBy: 'USER' } },
      },
    });

    // Release pandit availability
    if (booking.panditId) {
      await this.prisma.pandit.update({
        where: { id: booking.panditId },
        data: { totalBookings: { decrement: 1 } },
      });
    }

    this.eventEmitter.emit('booking.cancelled', { bookingId: id, reason });
    await this.redis.del(`bookings:user:${userId}`);
    if (booking.panditId) await this.redis.del(`bookings:pandit:${booking.panditId}`);

    return updated;
  }

  async confirm(id: string, panditId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.panditId !== panditId) throw new ForbiddenException('Not authorized');
    if (booking.status !== BookingStatus.PENDING) throw new BadRequestException('Booking not in pending state');

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CONFIRMED,
        confirmedAt: new Date(),
        timeline: { create: { status: BookingStatus.CONFIRMED, note: 'Confirmed by pandit', createdBy: 'PANDIT' } },
      },
    });

    this.eventEmitter.emit('booking.confirmed', { bookingId: id, panditId });
    await this.redis.del(`bookings:pandit:${panditId}`);
    await this.redis.del(`bookings:user:${booking.userId}`);

    return updated;
  }

  async start(id: string, panditId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.panditId !== panditId) throw new ForbiddenException('Not authorized');
    if (booking.status !== BookingStatus.CONFIRMED) throw new BadRequestException('Booking not confirmed');

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.IN_PROGRESS,
        startedAt: new Date(),
        timeline: { create: { status: BookingStatus.IN_PROGRESS, note: 'Service started', createdBy: 'PANDIT' } },
      },
    });
  }

  async complete(id: string, panditId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.panditId !== panditId) throw new ForbiddenException('Not authorized');
    if (booking.status !== BookingStatus.IN_PROGRESS) throw new BadRequestException('Booking not in progress');

    const updated = await this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id },
        data: {
          status: BookingStatus.COMPLETED,
          completedAt: new Date(),
          timeline: { create: { status: BookingStatus.COMPLETED, note: 'Service completed', createdBy: 'PANDIT' } },
        },
      });

      await tx.pandit.update({
        where: { id: panditId },
        data: {
          completedBookings: { increment: 1 },
          earnings: { increment: booking.totalAmount },
          rating: { increment: 0 }, // Will be recalculated from reviews
        },
      });

      return booking;
    });

    this.eventEmitter.emit('booking.completed', { bookingId: id, panditId });
    await this.redis.del(`bookings:pandit:${panditId}`);
    await this.redis.del(`bookings:user:${booking.userId}`);

    return updated;
  }

  async getUserBookings(userId: string, dto: BookingSearchDto) {
    return this.searchBookings({ ...dto, userId });
  }

  async getPanditBookings(panditId: string, dto: BookingSearchDto) {
    return this.searchBookings({ ...dto, panditId });
  }

  async searchBookings(dto: BookingSearchDto) {
    const { page = 1, limit = 10, userId, panditId, status, fromDate, toDate, sortBy = 'bookingDate', sortOrder = 'desc' } = dto;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {};
    if (userId) where.userId = userId;
    if (panditId) where.panditId = panditId;
    if (status) where.status = status;
    if (fromDate || toDate) {
      where.bookingDate = {};
      if (fromDate) where.bookingDate.gte = new Date(fromDate);
      if (toDate) where.bookingDate.lte = new Date(toDate);
    }

    const orderBy: Prisma.BookingOrderByWithRelationInput = (() => {
      const obj: Record<string, 'asc' | 'desc'> = {};
      obj[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';
      return obj as Prisma.BookingOrderByWithRelationInput;
    })();

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          pandit: { include: { user: { select: { id: true, name: true, avatar: true } } } },
          service: { select: { id: true, name: true, slug: true, basePrice: true } },
          payments: true,
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { data: bookings, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getUpcomingBookings(userId: string, limit = 5) {
    return this.prisma.booking.findMany({
      where: {
        userId,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] },
        bookingDate: { gte: new Date() },
      },
      take: limit,
      orderBy: { bookingDate: 'asc' },
      include: { service: true, pandit: { include: { user: { select: { name: true, phone: true } } } } },
    });
  }

  async getBookingStats(userId: string) {
    const [pending, confirmed, completed, cancelled] = await Promise.all([
      this.prisma.booking.count({ where: { userId, status: BookingStatus.PENDING } }),
      this.prisma.booking.count({ where: { userId, status: BookingStatus.CONFIRMED } }),
      this.prisma.booking.count({ where: { userId, status: BookingStatus.COMPLETED } }),
      this.prisma.booking.count({ where: { userId, status: BookingStatus.CANCELLED } }),
    ]);

    const totalSpent = await this.prisma.booking.aggregate({
      where: { userId, status: BookingStatus.COMPLETED },
      _sum: { totalAmount: true },
    });

    return { pending, confirmed, completed, cancelled, totalSpent: totalSpent._sum.totalAmount || 0 };
  }

  private async checkAvailability(panditId: string, date: string, startTime: string, endTime: string): Promise<boolean> {
    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getDay(); // 0-6

    // Check blocked dates
    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
      select: { blockedDates: true, weeklySchedule: true },
    });

    if (pandit?.blockedDates?.some(d => new Date(d).toDateString() === bookingDate.toDateString())) {
      return false;
    }

    // Check weekly schedule
    const schedule = pandit?.weeklySchedule as Record<string, { start: string; end: string }[]> || {};
    const daySchedule = schedule[dayOfWeek.toString()] || [];
    const isInSchedule = daySchedule.some(slot => slot.start <= startTime && slot.end >= endTime);

    // Check existing bookings
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        panditId,
        bookingDate,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] },
        OR: [
          { startTime: { lt: endTime }, endTime: { gt: startTime } },
        ],
      },
    });

    return isInSchedule && !existingBooking;
  }

  private async getPanditServicePrice(panditId: string, serviceId: string): Promise<number | null> {
    const ps = await this.prisma.panditService.findUnique({
      where: { panditId_serviceId: { panditId, serviceId } },
      select: { price: true },
    });
    return ps ? Number(ps.price) : null;
  }
}