import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { PanchangEntry, Prisma } from '@prisma/client';
import { CreatePanchangDto } from './dto/create-panchang.dto';

@Injectable()
export class PanchangService {
  private readonly logger = new Logger(PanchangService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(dto: CreatePanchangDto): Promise<PanchangEntry> {
    const entry = await this.prisma.panchangEntry.create({ data: { ...dto, date: new Date(dto.date) } });
    await this.redis.del(`panchang:${dto.date}`);
    return entry;
  }

  async createBulk(entries: CreatePanchangDto[]): Promise<number> {
    const data = entries.map(e => ({ ...e, date: new Date(e.date) }));
    const result = await this.prisma.panchangEntry.createMany({ data, skipDuplicates: true });
    await this.redis.del('panchang:calendar:cache');
    return result.count;
  }

  async findByDate(date: string): Promise<PanchangEntry | null> {
    const cached = await this.redis.get<PanchangEntry>(`panchang:${date}`);
    if (cached) return cached;

    const entry = await this.prisma.panchangEntry.findUnique({ where: { date: new Date(date) } });
    if (entry) await this.redis.set(`panchang:${date}`, entry, 86400); // 24 hours
    return entry;
  }

  async getRange(fromDate: string, toDate: string) {
    return this.prisma.panchangEntry.findMany({
      where: { date: { gte: new Date(fromDate), lte: new Date(toDate) } },
      orderBy: { date: 'asc' },
    });
  }

  async getMonth(year: number, month: number) {
    const fromDate = new Date(year, month - 1, 1);
    const toDate = new Date(year, month, 0);
    return this.getRange(fromDate.toISOString().split('T')[0], toDate.toISOString().split('T')[0]);
  }

  async getUpcomingFestivals(days = 30) {
    const fromDate = new Date();
    const toDate = new Date(Date.now() + days * 86400000);
    return this.prisma.panchangEntry.findMany({
      where: { date: { gte: fromDate, lte: toDate }, festivals: { isEmpty: false } },
      orderBy: { date: 'asc' },
      select: { date: true, festivals: true, vrats: true },
    });
  }

  async getTodaysPanchang() {
    const today = new Date().toISOString().split('T')[0];
    return this.findByDate(today);
  }

  // Simple calculation methods (in production, use Swiss Ephemeris or similar)
  private calculateTithi(date: Date): string {
    // Simplified - in production use proper astronomical calculations
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'];
    return tithis[Math.floor(Math.random() * tithis.length)];
  }

  private calculateNakshatra(date: Date): string {
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    return nakshatras[Math.floor(Math.random() * nakshatras.length)];
  }

  async generateForYear(year: number) {
    const entries: CreatePanchangDto[] = [];
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      entries.push({
        date: dateStr,
        tithi: this.calculateTithi(d),
        paksha: Math.random() > 0.5 ? 'Shukla' : 'Krishna',
        nakshatra: this.calculateNakshatra(d),
        yoga: 'Vishkambha',
        karana: 'Bava',
        sunrise: '06:30',
        sunset: '18:30',
        festivals: [],
        vrats: [],
      });
    }

    return this.createBulk(entries);
  }
}