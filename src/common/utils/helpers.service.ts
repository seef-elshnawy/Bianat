import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { WhereOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';
import {
  PageInfo,
  PaginationInput,
  PaginationResponse,
  ResponseType,
} from './responseType';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class HelperService {
  async encrypt(text: string, salt: number = 12) {
    return bcrypt.hash(text, salt);
  }

  async compare(origin: string, hashed: string) {
    return bcrypt.compare(origin, hashed);
  }

  enumColumn<T>(enumValue: T) {
    return Object.values(enumValue);
  }

  returnErrorResponse(
    message: string,
    code: number = 500,
    status: string = 'UnhandeledError',
  ) {
    return {
      message,
      status,
      code,
    };
  }
  // repo
  //pagintionINput {page?:number = 1 , limit?:number = 15}
  async paginate<T>(repo: typeof Model<T>, pagination: PageInfo) {
    //  repo.
    //@ts-expect-error
    const model = await repo.findAll({
      offset: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit,
    });
    console.log(model);
    return { data: model, pagination };
  }

  // make response
}
