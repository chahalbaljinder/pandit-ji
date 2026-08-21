import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Notification, NotificationType, NotificationChannel, NotificationStatus, Prisma } from '@prisma/client';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        channel: dto.channel || ['IN_APP'],
        title: dto.title,
        message: dto.message,
        data: dto.data,
        priority: dto.priority || 'NORMAL',
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      },
    });

    // Send immediately if not scheduled
    if (!dto.scheduledAt) {
      this.processNotification(notification.id);
    }

    return notification;
  }

  async createBulk(userIds: string[], dto: Omit<CreateNotificationDto, 'userId'>): Promise<number> {
    const data = userIds.map(userId => ({
      ...dto,
      userId,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
    }));

    const result = await this.prisma.notification.createMany({ data });
    return result.count;
  }

  async findByUser(userId: string, params: { page: number; limit: number; status?: NotificationStatus }) {
    const { page = 1, limit = 20, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };
    if (status) where.status = status;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.notification.count({ where }),
    ]);

    return { data: notifications, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { status: NotificationStatus.READ, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, status: { in: [NotificationStatus.SENT, NotificationStatus.DELIVERED] } },
      data: { status: NotificationStatus.READ, readAt: new Date() },
    });
    return result.count;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, status: { in: [NotificationStatus.SENT, NotificationStatus.DELIVERED] } },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.notification.deleteMany({ where: { id, userId } });
  }

  private async processNotification(notificationId: string): Promise<void> {
    const notification = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification) return;

    try {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { status: NotificationStatus.SENT, sentAt: new Date() },
      });

      // In production, integrate with actual providers
      for (const channel of notification.channel) {
        await this.sendViaChannel(notification, channel);
      }

      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { status: NotificationStatus.DELIVERED },
      });
    } catch (error) {
      this.logger.error(`Failed to send notification ${notificationId}:`, error);
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { status: NotificationStatus.FAILED, error: error.message },
      });
    }
  }

  private async sendViaChannel(notification: Notification, channel: NotificationChannel): Promise<void> {
    switch (channel) {
      case 'EMAIL':
        // await this.emailService.send(notification);
        break;
      case 'SMS':
        // await this.smsService.send(notification);
        break;
      case 'WHATSAPP':
        // await this.whatsappService.send(notification);
        break;
      case 'PUSH':
        // await this.pushService.send(notification);
        break;
      case 'IN_APP':
        // Already stored in DB
        break;
    }
  }

  // Event handlers
  async handleBookingCreated(payload: { bookingId: string; userId: string; panditId?: string }) {
    await this.create({
      userId: payload.userId,
      type: 'BOOKING_CONFIRMED',
      title: 'Booking Confirmed',
      message: `Your booking has been ${payload.panditId ? 'confirmed' : 'received'}.`,
      data: { bookingId: payload.bookingId },
      channel: ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'],
    });

    if (payload.panditId) {
      await this.create({
        userId: payload.panditId,
        type: 'PANDIT_ASSIGNED',
        title: 'New Booking Request',
        message: 'You have a new booking request.',
        data: { bookingId: payload.bookingId },
        channel: ['IN_APP', 'EMAIL', 'SMS'],
      });
    }
  }

  async handlePaymentCompleted(payload: { bookingId: string; userId: string }) {
    await this.create({
      userId: payload.userId,
      type: 'PAYMENT_SUCCESS',
      title: 'Payment Successful',
      message: 'Your payment has been processed successfully.',
      data: { bookingId: payload.bookingId },
      channel: ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'],
    });
  }
}