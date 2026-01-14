import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user } = req;
    const start = Date.now();

    this.logger.log(`${method} ${url} - Usuario: ${user?.email || 'No autenticado'}`);

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const time = Date.now() - start;
        this.logger.log(`${method} ${url} - ${res.statusCode} - ${time}ms`);
      }),
      catchError((error) => {
        const time = Date.now() - start;
        this.logger.error(`${method} ${url} - ${error.status || 500} - ${time}ms - ${error.message}`);
        return throwError(() => error);
      }),
    );
  }
}
