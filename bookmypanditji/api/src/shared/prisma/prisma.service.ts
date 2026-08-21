import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, LogLevel } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const logLevels: LogLevel[] = ['error', 'warn'];
    if (process.env.NODE_ENV !== 'production') {
      logLevels.push('query', 'info');
    }

    super({
      log: logLevels.map((level) => ({
        emit: 'event',
        level,
      })),
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected successfully');

    // Log queries in development
    if (process.env.NODE_ENV !== 'production') {
      this.$on('query', (e) => {
        this.logger.debug(`Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
      });
    }

    this.$on('error', (e) => {
      this.logger.error('Database error:', e);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }
    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && !key.startsWith('_') && !key.startsWith('$'),
    );
    for (const model of models) {
      if (typeof this[model as string]?.deleteMany === 'function') {
        await this[model as string].deleteMany();
      }
    }
  }
}