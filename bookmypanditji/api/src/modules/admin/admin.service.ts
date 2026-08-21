import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalPandits,
      totalBookings,
      totalRevenue,
      pendingVerifications,
      pendingBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.pandit.count(),
      this.prisma.booking.count(),
      this.prisma.booking.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
      this.prisma.pandit.count({ where: { verificationStatus: 'PENDING' } }),
      this.prisma.booking.count({ where: { status: 'PENDING' } }),
      this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
      this.prisma.booking.count({ where: { status: 'CANCELLED' } }),
    ]);

    return {
      totalUsers,
      totalPandits,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingVerifications,
      pendingBookings,
      completedBookings,
      cancelledBookings,
    };
  }

  async getRevenueAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;
    let groupBy: Prisma.BookingGroupByArgs['by'] = ['bookingDate'];

    switch (period) {
      case 'day': startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); break;
      case 'week': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
      case 'month': startDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
      case 'year': startDate = new Date(now.getFullYear(), 0, 1); break;
    }

    const bookings = await this.prisma.booking.groupBy({
      by: ['bookingDate', 'status'],
      where: { bookingDate: { gte: startDate } },
      _sum: { totalAmount: true },
      _count: true,
    });

    return bookings.map(b => ({
      date: b.bookingDate,
      status: b.status,
      revenue: Number(b._sum.totalAmount || 0),
      count: b._count,
    }));
  }

  async getUserGrowth(period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
      case 'month': startDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
      case 'year': startDate = new Date(now.getFullYear(), 0, 1); break;
    }

    const users = await this.prisma.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate }, role: 'USER' },
      _count: true,
    });

    return users.map(u => ({ date: u.createdAt, count: u._count }));
  }

  async getTopPandits(limit = 10) {
    return this.prisma.pandit.findMany({
      take: limit,
      orderBy: [{ rating: 'desc' }, { completedBookings: 'desc' }],
      include: { user: { select: { name: true, avatar: true } } },
    });
  }

  async getPopularServices(limit = 10) {
    return this.prisma.service.findMany({
      take: limit,
      orderBy: { bookings: { _count: 'desc' } },
      include: { _count: { select: { bookings: true } } },
    });
  }

  async getBookingTrends(days = 30) {
    const fromDate = new Date(Date.now() - days * 86400000);
    return this.prisma.booking.groupBy({
      by: ['bookingDate', 'status'],
      where: { bookingDate: { gte: fromDate } },
      _count: true,
    });
  }

  async getAuditLogs(params: { page: number; limit: number; userId?: string; action?: string }) {
    const { page = 1, limit = 50, userId, action } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};
    if (userId) where.userId = userId;
    if (action) where.action = { contains: action, mode: 'insensitive' };

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data: logs, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async logAction(data: { userId?: string; action: string; entityType: string; entityId?: string; oldData?: any; newData?: any; ipAddress?: string; userAgent?: string }) {
    return this.prisma.auditLog.create({ data });
  }
}