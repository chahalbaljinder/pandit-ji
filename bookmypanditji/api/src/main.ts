import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

  // Global prefix
  app.setGlobalPrefix(configService.get<string>('API_PREFIX') || 'api', {
    exclude: ['/health', '/metrics'],
  });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Security
  app.use(helmet({
    contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(compression());

  // CORS
  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  });

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: nodeEnv === 'production',
      validationError: { target: false, value: false },
    }),
  );

  // Global Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger Documentation
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('BookMyPanditJi API')
      .setDescription('API Documentation for BookMyPanditJi Platform')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT-auth',
      )
      .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management')
      .addTag('Pandits', 'Pandit management')
      .addTag('Services', 'Service catalog')
      .addTag('Bookings', 'Booking management')
      .addTag('Payments', 'Payment processing')
      .addTag('Products', 'Product catalog')
      .addTag('Temples', 'Temple & Darshan')
      .addTag('Panchang', 'Hindu Calendar')
      .addTag('Notifications', 'Notifications')
      .addTag('Admin', 'Admin operations')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  // Graceful shutdown
  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      await app.close();
      process.exit(0);
    });
  });

  await app.listen(port);
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  BookMyPanditJi API Server                                  ║
║  Environment: ${nodeEnv.padEnd(47)}║
║  Port: ${port.toString().padEnd(49)}║
║  API Docs: http://localhost:${port}/docs${' '.repeat(35)}║
║  Health:   http://localhost:${port}/health${' '.repeat(35)}║
╚══════════════════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});