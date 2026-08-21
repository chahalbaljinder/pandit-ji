import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { User, Role, UserStatus, Gender, MaritalStatus } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddVirtualUserDto } from './dto/add-virtual-user.dto';
import { UpdateVirtualUserDto } from './dto/update-virtual-user.dto';
import { AddAddressDto } from './dto/add-address.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        wallet: true,
        addresses: true,
        virtualUsers: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check email/phone uniqueness if being updated
    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email already in use');
    }
    if (dto.phone && dto.phone !== user.phone) {
      const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (existing) throw new ConflictException('Phone already in use');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        avatar: dto.avatar,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        timeOfBirth: dto.timeOfBirth,
        birthPlace: dto.birthPlace,
        gender: dto.gender,
        maritalStatus: dto.maritalStatus,
        anniversaryDate: dto.anniversaryDate ? new Date(dto.anniversaryDate) : null,
        spouseName: dto.spouseName,
        spousePhone: dto.spousePhone,
        spouseDob: dto.spouseDob ? new Date(dto.spouseDob) : null,
        spouseTob: dto.spouseTob,
        children: dto.children,
        facebookId: dto.facebookId,
        facebookToken: dto.facebookToken,
        canPostToFb: dto.canPostToFb,
      },
      include: { wallet: true, addresses: true, virtualUsers: true },
    });

    // Invalidate cache
    await this.redis.del(`user:profile:${userId}`);

    return updated;
  }

  async getProfile(userId: string): Promise<User | null> {
    // Try cache first
    const cached = await this.redis.get<User>(`user:profile:${userId}`);
    if (cached) return cached;

    const user = await this.findById(userId);
    if (user) {
      await this.redis.set(`user:profile:${userId}`, user, 300); // 5 min cache
    }
    return user;
  }

  async deactivateAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.INACTIVE },
    });
    await this.redis.del(`user:profile:${userId}`);
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.DELETED },
    });
    await this.redis.del(`user:profile:${userId}`);
  }

  // Virtual Users
  async addVirtualUser(userId: string, dto: AddVirtualUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.virtualUser.create({
      data: {
        userId,
        name: dto.name,
        relationship: dto.relationship,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        timeOfBirth: dto.timeOfBirth,
        gender: dto.gender,
        phone: dto.phone,
        email: dto.email,
        facebookId: dto.facebookId,
      },
    });
  }

  async updateVirtualUser(userId: string, virtualUserId: string, dto: UpdateVirtualUserDto) {
    const virtualUser = await this.prisma.virtualUser.findFirst({
      where: { id: virtualUserId, userId },
    });
    if (!virtualUser) throw new NotFoundException('Virtual user not found');

    return this.prisma.virtualUser.update({
      where: { id: virtualUserId },
      data: {
        name: dto.name,
        relationship: dto.relationship,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        timeOfBirth: dto.timeOfBirth,
        gender: dto.gender,
        phone: dto.phone,
        email: dto.email,
        facebookId: dto.facebookId,
        isActive: dto.isActive,
      },
    });
  }

  async deleteVirtualUser(userId: string, virtualUserId: string) {
    return this.prisma.virtualUser.deleteMany({
      where: { id: virtualUserId, userId },
    });
  }

  async getVirtualUsers(userId: string) {
    return this.prisma.virtualUser.findMany({
      where: { userId, isActive: true },
    });
  }

  // Addresses
  async addAddress(userId: string, dto: AddAddressDto) {
    // If this is default, unset other defaults
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        userId,
        type: dto.type,
        name: dto.name,
        line1: dto.line1,
        line2: dto.line2,
        city: dto.city,
        state: dto.state,
        pincode: dto.pincode,
        country: dto.country || 'India',
        latitude: dto.latitude,
        longitude: dto.longitude,
        isDefault: dto.isDefault || false,
      },
    });
  }

  async updateAddress(userId: string, addressId: string, dto: Partial<AddAddressDto>) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new NotFoundException('Address not found');

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    return this.prisma.address.deleteMany({
      where: { id: addressId, userId },
    });
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async getDefaultAddress(userId: string) {
    return this.prisma.address.findFirst({
      where: { userId, isDefault: true },
    });
  }

  // Admin methods
  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    role?: Role;
    status?: UserStatus;
  }) {
    const { page, limit, search, role, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }
    if (role) where.role = role;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          phone: true,
          name: true,
          avatar: true,
          role: true,
          status: true,
          emailVerified: true,
          phoneVerified: true,
          lastLoginAt: true,
          createdAt: true,
          _count: { select: { bookings: true, reviews: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }

  async updateUserRole(userId: string, role: Role) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}