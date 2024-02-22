import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';

export function staticRespone<TItem extends object>(
  TitemClass: ClassType<TItem> | ClassType<TItem>[],
) {
  @ObjectType()
  abstract class staticResponseArrClass {
    @Field((type) => TitemClass)
    data: TItem[];
    @Field((type) => Int)
    code: number;
    @Field((type) => String)
    message: string;
  }

  @ObjectType()
  abstract class staticResponseClass {
    @Field((type) => TitemClass)
    data: TItem;
    @Field((type) => Int)
    code: number;
    @Field((type) => String)
    message: string;
  }

  return Array.isArray(TitemClass)
    ? staticResponseArrClass
    : staticResponseClass;
}

export class ResponseType<T> {
  data: T;
  code: number;
  message: string;
}
export interface PaginationInput {
  page?: number;
  limit?: number;
}
export class PaginationResponse<T> {
  data: T;
  code: number;
  message: string;
}
export function Pagination<TItem extends object>(
  TItemClass: ClassType<TItem>[],
) {
  @ObjectType()
  abstract class PaginationResponseArrClass {
    @Field((type) => TItemClass)
    data: TItem[];
    @Field((type) => PageInfo)
    pagination: PageInfo;
    @Field((type) => Int)
    code: number;
    @Field((type) => String)
    message: string;
  }
  return PaginationResponseArrClass;
}

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field()
  hasNext: boolean;

  @Field()
  hasPrevious: boolean;

  @Field(() => Int)
  totalCount: number;
}
