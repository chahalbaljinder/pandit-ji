import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { Temple, Prisma } from '@prisma/client';
import { CreateTempleDto } from './dto/create-temple.dto';
import { UpdateTempleDto } from './dto/update-temple.dto';
import { TempleSearchDto } from './dto/temple-search.dto';

@Injectable()
export class TemplesService {
  private readonly logger = new Logger(TemplesService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(dto: CreateTempleDto): Promise<Temple> {
    const slugExists = await this.prisma.temple.findUnique({ where: { slug: dto.slug } });
    if (slugExists) throw new Error('Temple with this slug already exists');

    const temple = await this.prisma.temple.create({ data: dto });
    await this.redis.del('temples:list:cache');
    this.logger.log(`Temple created: ${temple.id}`);
    return temple;
  }

  async findById(id: string): Promise<Temple | null> {
    const cached = await this.redis.get<Temple>(`temple:${id}`);
    if (cached) return cached;

    const temple = await this.prisma.temple.findUnique({
      where: { id },
      include: { bookings: { take: 5, orderBy: { bookingDate: 'desc' } } },
    });

    if (temple) await this.redis.set(`temple:${id}`, temple, 300);
    return temple;
  }

  async findBySlug(slug: string): Promise<Temple | null> {
    return this.prisma.temple.findUnique({ where: { slug } });
  }

  async update(id: string, dto: UpdateTempleDto): Promise<Temple> {
    const temple = await this.prisma.temple.findUnique({ where: { id } });
    if (!temple) throw new NotFoundException('Temple not found');

    const updated = await this.prisma.temple.update({ where: { id }, data: dto });
    await this.redis.del(`temple:${id}`);
    await this.redis.del('temples:list:cache');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.temple.delete({ where: { id } });
    await this.redis.del(`temple:${id}`);
    await this.redis.del('temples:list:cache');
  }

  async search(dto: TempleSearchDto) {
    const { page = 1, limit = 10, city, state, hasLiveDarshan, search, sortBy = 'name', sortOrder = 'asc' } = dto;
    const skip = (page - 1) * limit;

    const where: Prisma.TempleWhereInput = {};
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    if (hasLiveDarshan !== undefined) where.hasLiveDarshan = hasLiveDarshan;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { deity: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.TempleOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    const [temples, total] = await Promise.all([
      this.prisma.temple.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.temple.count({ where }),
    ]);

    return { data: temples, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getLiveDarshanTemples() {
    return this.prisma.temple.findMany({
      where: { hasLiveDarshan: true },
      orderBy: { name: 'asc' },
    });
  }

  async getCities() {
    const temples = await this.prisma.temple.findMany({
      select: { city: true, state: true },
      distinct: ['city', 'state'],
    });
    return temples.map(t => ({ city: t.city, state: t.state }));
  }
}