import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User, Role, UserStatus } from '@prisma/client';

export interface TokenPayload {
  sub: string;
  email?: string;
  phone?: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly bcryptRounds = 12;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          dto.email ? { email: dto.email } : {},
          dto.phone ? { phone: dto.phone } : {},
        ].filter((o) => Object.keys(o).length > 0),
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        name: dto.name,
        role: dto.role || Role.USER,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        gender: dto.gender,
      },
    });

    // Create wallet
    await this.prisma.wallet.create({
      data: { userId: user.id },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Store refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    // Emit event
    this.eventEmitter.emit('user.registered', { userId: user.id, email: user.email, phone: user.phone });

    this.logger.log(`User registered: ${user.id}`);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    const user = await this.validateUser(dto.identifier, dto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    this.eventEmitter.emit('user.logged_in', { userId: user.id });

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async validateUser(identifier: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  async refreshTokens(dto: RefreshTokenDto): Promise<AuthTokens> {
    const storedToken = await this.redis.get<string>(`refresh_token:${dto.refreshToken}`);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userId = storedToken;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Revoke old refresh token
    await this.redis.del(`refresh_token:${dto.refreshToken}`);

    // Generate new tokens
    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await this.redis.del(`refresh_token:${refreshToken}`);
    } else {
      // Revoke all refresh tokens for user
      const keys = await this.redis.client.keys(`refresh_token:*`);
      for (const key of keys) {
        const value = await this.redis.get<string>(key);
        if (value === userId) {
          await this.redis.del(key);
        }
      }
    }

    this.eventEmitter.emit('user.logged_out', { userId });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, this.bcryptRounds);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Revoke all sessions
    await this.logout(userId);

    this.eventEmitter.emit('user.password_changed', { userId });
  }

  async requestPasswordReset(identifier: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token (store in Redis with 1 hour expiry)
    const resetToken = uuidv4();
    await this.redis.set(`password_reset:${resetToken}`, user.id, 3600);

    // Emit event for email/SMS sending
    this.eventEmitter.emit('user.password_reset_requested', {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      resetToken,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const userId = await this.redis.get<string>(`password_reset:${token}`);

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, this.bcryptRounds);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await this.redis.del(`password_reset:${token}`);
    await this.logout(userId);

    this.eventEmitter.emit('user.password_reset', { userId });
  }

  async verifyEmail(token: string): Promise<void> {
    const userId = await this.redis.get<string>(`email_verify:${token}`);

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });

    await this.redis.del(`email_verify:${token}`);
    this.eventEmitter.emit('user.email_verified', { userId });
  }

  async sendEmailVerification(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.email) return;

    const verifyToken = uuidv4();
    await this.redis.set(`email_verify:${verifyToken}`, userId, 86400); // 24 hours

    this.eventEmitter.emit('user.email_verification_sent', {
      userId,
      email: user.email,
      verifyToken,
    });
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined,
      role: user.role,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '7d';
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    // Calculate expires in seconds
    const expiresInSeconds = this.parseExpiry(expiresIn);

    return { accessToken, refreshToken, expiresIn: expiresInSeconds };
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([dhms])$/);
    if (!match) return 604800; // 7 days default

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd': return value * 86400;
      case 'h': return value * 3600;
      case 'm': return value * 60;
      case 's': return value;
      default: return 604800;
    }
  }

  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const refreshExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d';
    const ttl = this.parseExpiry(refreshExpiry);
    await this.redis.set(`refresh_token:${refreshToken}`, userId, ttl);
  }

  private sanitizeUser(user: User): Partial<User> {
    const { passwordHash, mfaSecret, backupCodes, ...sanitized } = user;
    return sanitized;
  }
}