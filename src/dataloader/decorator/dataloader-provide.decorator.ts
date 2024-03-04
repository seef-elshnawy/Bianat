import { Injectable, SetMetadata, Type, applyDecorators } from '@nestjs/common';
import { DataloaderFactory } from '../dataloader-factory.interface';
import { METADATA_KEY } from '../constant';

export function DataLoaderProvider(): (
  target: Type<DataloaderFactory>,
) => void {
  return applyDecorators(Injectable(), SetMetadata(METADATA_KEY, true));
}
