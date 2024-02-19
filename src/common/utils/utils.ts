import { Field, InputType } from '@nestjs/graphql';
import { DataType } from 'sequelize-typescript';
// import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

export function enumColumn<T extends Record<string, string>>(enumValue: T) {
  return DataType.ENUM(...Object.values(enumValue));
}

@InputType()
export class ImageUploader {
  @Field(() => GraphQLUpload)
  image: Promise<FileUpload>;
}
