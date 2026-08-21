import { Module } from '@nestjs/common';
import { PanditsService } from './pandits.service';
import { PanditsController } from './pandits.controller';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { RedisModule } from '../../shared/redis/redis.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, RedisModule, UsersModule],
  controllers: [PanditsController],
  providers: [PanditsService],
  exports: [PanditsService],
})
export class PanditsModule {}