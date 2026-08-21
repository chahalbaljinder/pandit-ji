import { Module } from '@nestjs/common';
import { TemplesService } from './temples.service';
import { TemplesController } from './temples.controller';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { RedisModule } from '../../shared/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [TemplesController],
  providers: [TemplesService],
  exports: [TemplesService],
})
export class TemplesModule {}