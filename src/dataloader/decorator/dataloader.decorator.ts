import {
  ExecutionContext,
  InjectionToken,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { DataloaderMap } from '../dataloader.registery';
import { GQL_CONTEXT_KEY } from '../constant';
import { dataloaderInterceptor } from '../dataloader.interceptor';
import { DataLoaderProvider } from './dataloader-provide.decorator';

const tokenToString = (token: InjectionToken): string => {
  if (typeof token === 'string') {
    return token;
  } else if (typeof token === 'symbol') {
    return String(token);
  } else {
    return token.name;
  }
};

export const LoaderDecoratorFactory = async (
  token: InjectionToken,
  context: ExecutionContext,
): Promise<DataLoader<any, any, any>> => {
  const gqlContext: any = GqlExecutionContext.create(context).getContext();
  const dataloaders: DataloaderMap | undefined = gqlContext[GQL_CONTEXT_KEY];
  if (!dataloaders) {
    throw new InternalServerErrorException(
      `No dataloaders found in GraphQL context object. Did you forget to provide the ${dataloaderInterceptor.name}?`,
    );
  }
  const dataloader = dataloaders.get(token);
  if (!dataloader) {
    throw new InternalServerErrorException(
      `No dataloader found for ${tokenToString(token)}. Did you forget to decorate it with @${
        DataLoaderProvider.name
      }()?`,
    );
  }
  return dataloader;
};

export const Loader = createParamDecorator(LoaderDecoratorFactory);
