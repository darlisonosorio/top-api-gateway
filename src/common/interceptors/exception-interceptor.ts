import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {

        if (err?.response && err?.response?.statusCode) {
          throw new HttpException(
            err.response.message,
            err.response.statusCode,
          );
        }
       
        throw new HttpException(
          err?.message || 'Internal server error',
          err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
