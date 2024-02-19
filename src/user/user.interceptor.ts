import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, map } from 'rxjs';

export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = GqlExecutionContext.create(context).getContext();
    return next.handle().pipe(
      map((data: any) => {
        {
          return {
            data: data.data,
            code: data.code || 200,
            pagination: data.pagination || null,
            message: data.message || 'ok',
          };
        }
      }),
    );
  }
}
