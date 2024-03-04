import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GQL_CONTEXT_KEY } from './constant';
import { dataLoaderRegistry } from './dataloader.registery';

@Injectable()
export class dataloaderInterceptor<T> implements NestInterceptor<string, T> {
  constructor(private dataloaderDiscovery: dataLoaderRegistry) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<T> {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const loader = this.dataloaderDiscovery.createDataLoaderMap(
      GqlExecutionContext.create(context),
    );
    gqlContext[GQL_CONTEXT_KEY] = loader;
    return next.handle();
  }
}
