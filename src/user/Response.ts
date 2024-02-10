import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from './entity/user.entity';

export default function staticRespone<TItem extends object>(
  TitemClass: Type<TItem>,
) {
  @ObjectType()
  abstract class staticResponseClass {
    @Field((type) => Int)
    code: number;
    @Field((type) => String)
    status: string;
  }
  return staticResponseClass;
}

@ObjectType()
export class staticResponseUser extends staticRespone(User) {
  @Field((type) => User)
  data: User;
}

@ObjectType()
export class staticResponseUsers extends staticRespone(User) {
  @Field((type) => [User])
  data: User[];
}

@ObjectType()
export class staticResponseMessage extends staticRespone(User) {
  @Field((type) => String)
  data: string;
}
