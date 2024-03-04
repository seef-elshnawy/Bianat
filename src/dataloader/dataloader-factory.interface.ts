import { GqlExecutionContext } from '@nestjs/graphql';
import DataLoader from 'dataloader';


export interface DataloaderFactory<K = unknown, V = unknown, C = K> {
  /**
   * @param ctx - the GraphQL execution context
   */
  createDataloader(ctx: GqlExecutionContext): DataLoader<K, V, C>;
}