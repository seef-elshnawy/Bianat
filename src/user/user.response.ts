import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Pagination, staticRespone } from 'src/common/utils/responseType';
import { User } from './entity/user.entity';

@ObjectType()
export class UserReponse extends staticRespone(User) {} // typegraph

@ObjectType()
export class UsersReponse extends staticRespone(Array(User)) {}

@ObjectType()
export class UserReponseString extends staticRespone(String) {}

@ObjectType()
export class PaginationResponse extends Pagination(Array(User)) {}
