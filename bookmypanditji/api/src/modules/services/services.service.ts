import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { Service, ServiceCategory, PriceType, Prisma } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceSearchDto } from './dto/service-search.dto';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const existing = await this.prisma.service.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Service with this slug already exists');

    const service = await this.prisma.service.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        shortDesc: dto.shortDesc,
        category: dto.category,
        subCategory: dto.subCategory,
        durationMinutes: dto.durationMinutes || 60,
        minPandits: dto.minPandits || 1,
        maxPandits: dto.maxPandits || 3,
        requiredSamagri: dto.requiredSamagri,
        optionalSamagri: dto.optionalSamagri,
        basePrice: dto.basePrice,
        priceType: dto.priceType || PriceType.FIXED,
        priceRangeMin: dto.priceRangeMin,
        priceRangeMax: dto.priceRangeMax,
        images: dto.images || [],
        videoUrl: dto.videoUrl,
        advanceBookingDays: dto.advanceBookingDays || 30,
        allowUrgentBooking: dto.allowUrgentBooking ?? true,
        urgentSurcharge: dto.urgentSurcharge,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        keywords: dto.keywords || [],
      },
    });

    await this.redis.del('services:list:cache');
    this.logger.log(`Service created: ${service.id}`);
    return service;
  }

  async findById(id: string): Promise<Service | null> {
    const cached = await this.redis.get<Service>(`service:${id}`);
    if (cached) return cached;

    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        panditServices: { include: { pandit: { include: { user: { select: { id: true, name: true, avatar: true } } } } } },
        products: true,
        _count: { select: { bookings: true, panditServices: true } },
      },
    });

    if (service) await this.redis.set(`service:${id}`, service, 300);
    return service;
  }

  async findBySlug(slug: string): Promise<Service | null> {
    return this.prisma.service.findUnique({
      where: { slug },
      include: { panditServices: { include: { pandit: true } }, products: true },
    });
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');

    if (dto.slug && dto.slug !== service.slug) {
      const existing = await this.prisma.service.findUnique({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Slug already in use');
    }

    const updated = await this.prisma.service.update({
      where: { id },
      data: dto,
      include: { panditServices: { include: { pandit: true } }, products: true },
    });

    await this.redis.del(`service:${id}`);
    await this.redis.del('services:list:cache');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({ where: { id } });
    await this.redis.del(`service:${id}`);
    await this.redis.del('services:list:cache');
  }

  async search(dto: ServiceSearchDto) {
    const { page = 1, limit = 10, category, search, minPrice, maxPrice, sortBy = 'name', sortOrder = 'asc' } = dto;
    const skip = (page - 1) * limit;

    const where: Prisma.ServiceWhereInput = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = minPrice;
      if (maxPrice) where.basePrice.lte = maxPrice;
    }

    const orderBy: Prisma.ServiceOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          panditServices: { include: { pandit: { include: { user: { select: { id: true, name: true, avatar: true } } } } } },
          _count: { select: { bookings: true } },
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    return { data: services, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getCategories() {
    return Object.values(ServiceCategory);
  }

  async getFeatured(limit = 8) {
    return this.prisma.service.findMany({
      take: limit,
      orderBy: { bookings: { _count: 'desc' } },
      include: { _count: { select: { bookings: true } } },
    });
  }

  async addPanditService(serviceId: string, panditId: string, price: number) {
    return this.prisma.panditService.create({
      data: { serviceId, panditId, price },
    });
  }

  async removePanditService(serviceId: string, panditId: string) {
    return this.prisma.panditService.deleteMany({ where: { serviceId, panditId } });
  }

  async getPanditServices(panditId: string) {
    return this.prisma.panditService.findMany({
      where: { panditId, isActive: true },
      include: { service: true },
    });
  }
}