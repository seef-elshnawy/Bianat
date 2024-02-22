import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Model } from 'sequelize-typescript';
import { PageInfo } from './responseType';

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
  async paginate<T>(repo: typeof Model<T>, pagination: PageInfo) {
    //@ts-expect-error
    const model = await repo.findAll({
      offset: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit,
    });
    console.log(model);
    return { data: model, pagination };
  }
}
