import { Injectable, NotFoundException, ConflictException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { Pandit, VerificationStatus, Prisma } from '@prisma/client';
import { CreatePanditProfileDto } from './dto/create-pandit-profile.dto';
import { UpdatePanditProfileDto } from './dto/update-pandit-profile.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { PanditSearchDto } from './dto/pandit-search.dto';

@Injectable()
export class PanditsService {
  private readonly logger = new Logger(PanditsService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createProfile(userId: string, dto: CreatePanditProfileDto): Promise<Pandit> {
    const existing = await this.prisma.pandit.findUnique({ where: { userId } });
    if (existing) {
      throw new ConflictException('Pandit profile already exists for this user');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Update user role to PANDIT
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'PANDIT' },
    });

    const pandit = await this.prisma.pandit.create({
      data: {
        userId,
        title: dto.title,
        bio: dto.bio,
        experienceYears: dto.experienceYears || 0,
        education: dto.education,
        specializations: dto.specializations || [],
        languages: dto.languages || ['Hindi', 'English'],
        serviceCities: dto.serviceCities || [],
        serviceRadius: dto.serviceRadius,
        baseLatitude: dto.baseLatitude,
        baseLongitude: dto.baseLongitude,
        addressId: dto.addressId,
        weeklySchedule: dto.weeklySchedule || {},
        blockedDates: dto.blockedDates || [],
        basePrice: dto.basePrice,
        pricingMode: dto.pricingMode || 'FIXED',
        customPricing: dto.customPricing,
        galleryImages: dto.galleryImages || [],
        videoIntro: dto.videoIntro,
        documents: dto.documents || [],
        verificationStatus: VerificationStatus.PENDING,
      },
      include: { user: true, services: { include: { service: true } } },
    });

    await this.redis.del('pandits:search:cache');
    this.logger.log(`Pandit profile created: ${pandit.id} for user: ${userId}`);

    return pandit;
  }

  async getProfile(panditId: string): Promise<Pandit | null> {
    const cached = await this.redis.get<Pandit>(`pandit:profile:${panditId}`);
    if (cached) return cached;

    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
      include: {
        user: { select: { id: true, name: true, avatar: true, phone: true, email: true } },
        services: { include: { service: true } },
        availability: true,
        reviews: { where: { status: 'PUBLISHED' }, take: 10, orderBy: { createdAt: 'desc' } },
        _count: { select: { bookings: true, reviews: true } },
      },
    });

    if (pandit) {
      await this.redis.set(`pandit:profile:${panditId}`, pandit, 300);
    }
    return pandit;
  }

  async getProfileByUserId(userId: string): Promise<Pandit | null> {
    return this.prisma.pandit.findUnique({
      where: { userId },
      include: { services: { include: { service: true } }, availability: true },
    });
  }

  async updateProfile(panditId: string, userId: string, dto: UpdatePanditProfileDto): Promise<Pandit> {
    const pandit = await this.prisma.pandit.findUnique({ where: { id: panditId } });
    if (!pandit) throw new NotFoundException('Pandit profile not found');
    if (pandit.userId !== userId) throw new ForbiddenException('Not authorized to update this profile');

    const updated = await this.prisma.pandit.update({
      where: { id: panditId },
      data: {
        title: dto.title,
        bio: dto.bio,
        experienceYears: dto.experienceYears,
        education: dto.education,
        specializations: dto.specializations,
        languages: dto.languages,
        serviceCities: dto.serviceCities,
        serviceRadius: dto.serviceRadius,
        baseLatitude: dto.baseLatitude,
        baseLongitude: dto.baseLongitude,
        addressId: dto.addressId,
        weeklySchedule: dto.weeklySchedule,
        blockedDates: dto.blockedDates,
        basePrice: dto.basePrice,
        pricingMode: dto.pricingMode,
        customPricing: dto.customPricing,
        galleryImages: dto.galleryImages,
        videoIntro: dto.videoIntro,
      },
      include: { user: true, services: { include: { service: true } }, availability: true },
    });

    await this.redis.del(`pandit:profile:${panditId}`);
    await this.redis.del('pandits:search:cache');
    return updated;
  }

  async updateAvailability(panditId: string, userId: string, dto: UpdateAvailabilityDto): Promise<Pandit> {
    const pandit = await this.prisma.pandit.findUnique({ where: { id: panditId } });
    if (!pandit) throw new NotFoundException('Pandit profile not found');
    if (pandit.userId !== userId) throw new ForbiddenException('Not authorized');

    // Update weekly schedule
    if (dto.weeklySchedule) {
      await this.prisma.availability.deleteMany({ where: { panditId } });
      for (const [day, slots] of Object.entries(dto.weeklySchedule)) {
        for (const slot of slots as any[]) {
          await this.prisma.availability.create({
            data: { panditId, dayOfWeek: parseInt(day), startTime: slot.start, endTime: slot.end },
          });
        }
      }
    }

    // Update blocked dates
    if (dto.blockedDates) {
      await this.prisma.pandit.update({
        where: { id: panditId },
        data: { blockedDates: dto.blockedDates },
      });
    }

    await this.redis.del(`pandit:profile:${panditId}`);
    return this.getProfile(panditId);
  }

  async searchPandits(dto: PanditSearchDto) {
    const { page = 1, limit = 10, city, specialization, language, minRating, maxPrice, lat, lng, radius, sortBy = 'rating', sortOrder = 'desc' } = dto;
    const skip = (page - 1) * limit;

    const where: Prisma.PanditWhereInput = {
      verificationStatus: VerificationStatus.VERIFIED,
      user: { status: 'ACTIVE' },
    };

    if (city) where.serviceCities = { has: city };
    if (specialization) where.specializations = { has: specialization };
    if (language) where.languages = { has: language };
    if (minRating) where.rating = { gte: minRating };
    if (maxPrice) where.basePrice = { lte: maxPrice };

    // Geo search
    if (lat && lng && radius) {
      where.baseLatitude = { not: null };
      where.baseLongitude = { not: null };
    }

    const orderBy: Prisma.PanditOrderByWithRelationInput = {};
    if (sortBy === 'rating') orderBy.rating = sortOrder;
    else if (sortBy === 'price') orderBy.basePrice = sortOrder;
    else if (sortBy === 'experience') orderBy.experienceYears = sortOrder;
    else if (sortBy === 'bookings') orderBy.totalBookings = sortOrder;
    else orderBy.rating = 'desc';

    const [pandits, total] = await Promise.all([
      this.prisma.pandit.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          services: { include: { service: { select: { id: true, name: true, slug: true, basePrice: true, images: true } } } },
          _count: { select: { reviews: true } },
        },
      }),
      this.prisma.pandit.count({ where }),
    ]);

    // Calculate distance if geo provided
    let results = pandits;
    if (lat && lng && radius) {
      results = pandits
        .map((p) => ({
          ...p,
          distance: p.baseLatitude && p.baseLongitude
            ? this.calculateDistance(lat, lng, p.baseLatitude, p.baseLongitude)
            : null,
        }))
        .filter((p) => p.distance === null || p.distance <= radius)
        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    return {
      data: results,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getFeaturedPandits(limit = 6) {
    return this.prisma.pandit.findMany({
      where: { verificationStatus: VerificationStatus.VERIFIED, user: { status: 'ACTIVE' } },
      take: limit,
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        services: { include: { service: { select: { id: true, name: true, slug: true, basePrice: true } } } },
      },
    });
  }

  async getPanditStats(panditId: string) {
    const pandit = await this.prisma.pandit.findUnique({
      where: { id: panditId },
      select: {
        rating: true,
        reviewCount: true,
        totalBookings: true,
        completedBookings: true,
        earnings: true,
        _count: { select: { bookings: { where: { status: { in: ['PENDING', 'CONFIRMED'] } } } } },
      },
    });

    if (!pandit) throw new NotFoundException('Pandit not found');

    const upcomingBookings = await this.prisma.booking.count({
      where: { panditId, status: { in: ['PENDING', 'CONFIRMED'] }, bookingDate: { gte: new Date() } },
    });

    const thisMonthEarnings = await this.prisma.booking.aggregate({
      where: {
        panditId,
        status: 'COMPLETED',
        completedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
      _sum: { totalAmount: true },
    });

    return {
      ...pandit,
      upcomingBookings,
      thisMonthEarnings: thisMonthEarnings._sum.totalAmount || 0,
    };
  }

  async getEarnings(panditId: string, period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week': startDate = new Date(now.getTime() - 7 * 86400000); break;
      case 'month': startDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
      case 'year': startDate = new Date(now.getFullYear(), 0, 1); break;
    }

    const bookings = await this.prisma.booking.findMany({
      where: { panditId, status: 'COMPLETED', completedAt: { gte: startDate } },
      select: { totalAmount: true, completedAt: true, servicePrice: true, platformFee: true },
    });

    const total = bookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
    const platformFees = bookings.reduce((sum, b) => sum + Number(b.platformFee), 0);
    const netEarnings = total - platformFees;

    return { total, platformFees, netEarnings, count: bookings.length, period };
  }

  // Admin methods
  async verifyPandit(panditId: string, adminId: string, status: VerificationStatus, rejectionReason?: string) {
    const pandit = await this.prisma.pandit.update({
      where: { id: panditId },
      data: {
        verificationStatus: status,
        verifiedAt: status === VerificationStatus.VERIFIED ? new Date() : null,
        verifiedBy: adminId,
        rejectionReason: status === VerificationStatus.REJECTED ? rejectionReason : null,
      },
    });

    await this.redis.del(`pandit:profile:${panditId}`);
    await this.redis.del('pandits:search:cache');
    return pandit;
  }

  async getPendingVerifications(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [pandits, total] = await Promise.all([
      this.prisma.pandit.findMany({
        where: { verificationStatus: VerificationStatus.PENDING },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      }),
      this.prisma.pandit.count({ where: { verificationStatus: VerificationStatus.PENDING } }),
    ]);
    return { data: pandits, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}