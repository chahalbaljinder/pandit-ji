import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { RedisModule } from '../../shared/redis/redis.module';
import { UsersModule } from '../users/users.module';
import { PanditsModule } from '../pandits/pandits.module';
import { ServicesModule } from '../services/services.module';
import { BookingsModule } from '../bookings/bookings.module';
import { PaymentsModule } from '../payments/payments.module';
import { ProductsModule } from '../products/products.module';
import { TemplesModule } from '../temples/temples.module';
import { PanchangModule } from '../panchang/panchang.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    UsersModule,
    PanditsModule,
    ServicesModule,
    BookingsModule,
    PaymentsModule,
    ProductsModule,
    TemplesModule,
    PanchangModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}