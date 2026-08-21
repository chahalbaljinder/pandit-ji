import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../../shared/redis/redis.service';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private redis: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const refreshToken = (req.body as any)?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    const storedUserId = await this.redis.get<string>(`refresh_token:${refreshToken}`);
    if (!storedUserId || storedUserId !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { userId: payload.sub, refreshToken };
  }
}