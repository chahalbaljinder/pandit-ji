import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { ChatRoom, ChatMessage, Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getOrCreateRoom(bookingId: string, userId: string, panditId: string): Promise<ChatRoom> {
    let room = await this.prisma.chatRoom.findUnique({ where: { bookingId } });

    if (!room) {
      room = await this.prisma.chatRoom.create({
        data: { bookingId, userId, panditId },
      });
    }

    return room;
  }

  async sendMessage(roomId: string, senderId: string, content: string, type = 'TEXT', metadata?: any): Promise<ChatMessage> {
    const room = await this.prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new Error('Chat room not found');

    if (room.userId !== senderId && room.panditId !== senderId) {
      throw new Error('Not authorized to send message in this room');
    }

    const message = await this.prisma.chatMessage.create({
      data: { roomId, senderId, content, type, metadata },
    });

    await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { lastMessage: content, lastMessageAt: new Date() },
    });

    // Publish to Redis for real-time
    await this.redis.publish(`chat:room:${roomId}`, { message, senderId });

    return message;
  }

  async getMessages(roomId: string, userId: string, page = 1, limit = 50) {
    const room = await this.prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new Error('Chat room not found');
    if (room.userId !== userId && room.panditId !== userId) throw new Error('Not authorized');

    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where: { roomId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.chatMessage.count({ where: { roomId } }),
    ]);

    return { data: messages.reverse(), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async markAsRead(roomId: string, userId: string): Promise<void> {
    const room = await this.prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) return;
    if (room.userId !== userId && room.panditId !== userId) return;

    await this.prisma.chatMessage.updateMany({
      where: { roomId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async getUserRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: { OR: [{ userId }, { panditId: userId }], isActive: true },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        pandit: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        booking: { select: { id: true, bookingNumber: true, service: { select: { name: true } } } },
      },
    });
  }

  async closeRoom(roomId: string, userId: string): Promise<void> {
    const room = await this.prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) return;
    if (room.userId !== userId && room.panditId !== userId) return;

    await this.prisma.chatRoom.update({ where: { id: roomId }, data: { isActive: false } });
  }
}