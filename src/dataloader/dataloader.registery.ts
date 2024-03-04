import { ContextIdFactory, DiscoveryService, ModuleRef } from '@nestjs/core';
import {
  Injectable,
  InjectionToken,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import DataLoader from 'dataloader';
import { METADATA_KEY } from './constant';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataloaderFactory } from './dataloader-factory.interface';
import { threadId } from 'worker_threads';

export type DataloaderMap = Map<InjectionToken, DataLoader<any, any, any>>;

@Injectable()
export class dataLoaderRegistry implements OnModuleInit {
  private providers?: InstanceWrapper<DataloaderFactory<any, any, any>>[];
  constructor(private dicover: DiscoveryService) {}

  async onModuleInit() {
    this.providers = this.discoverDataLoaders();
  }
  discoverDataLoaders() {
    return this.dicover
      .getProviders()
      .filter(
        (provider) =>
          provider.metatype &&
          Reflect.getMetadata(METADATA_KEY, provider.metatype),
      );
  }
  createDataLoaderMap(ctx: GqlExecutionContext): DataloaderMap {
    if (!this.providers) {
      throw new InternalServerErrorException(
        `discoverDataloaders() must be called before createDataloaderMap(...)`,
      );
    }
    
    return new Map(
      this.providers.map((factory) => [
        factory.token,
        factory.instance.createDataloader(ctx),
      ]),
    );
  }
}
