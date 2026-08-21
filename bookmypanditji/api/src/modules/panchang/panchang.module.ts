import { Module } from '@nestjs/common';
import { PanchangService } from './panchang.service';
import { PanchangController } from './panchang.controller';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { RedisModule } from '../../shared/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [PanchangController],
  providers: [PanchangService],
  exports: [PanchangService],
})
export class PanchangModule {}