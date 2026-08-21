import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const requestId = headers['x-request-id'] || crypto.randomUUID();
    const startTime = Date.now();

    // Add request ID to response headers
    const response = context.switchToHttp().getResponse();
    response.header('x-request-id', requestId);

    this.logger.log(`Incoming: ${method} ${url} - IP: ${ip} - UA: ${userAgent}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(`Completed: ${method} ${url} - ${duration}ms`);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(`Failed: ${method} ${url} - ${duration}ms - ${error.message}`);
        },
      }),
    );
  }
}