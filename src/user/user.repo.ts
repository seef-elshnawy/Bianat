import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.entity';
import { PageInfo } from 'src/common/utils/responseType';
import { DestroyOptions, FindOptions, WhereOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';

@Injectable()
export class UserRepo extends User {
  constructor(@InjectModel(User) private model: typeof User) {
    super();
  }

  async findPaginate(page: number, limit: number, pagination: PageInfo) {
    const users = await this.model.findAll({
      offset: (page - 1) * limit,
      limit,
    });
    return { data: users, pagination };
  }
  async findAll(): Promise<User[]> {
    return await this.model.findAll();
  }

  async findById(id: number): Promise<User> {
    return await this.model.findByPk(id);
  }

  async create(entity: Partial<User>) {
    return this.model.create(entity);
  }
  async remove(destroyOptions: DestroyOptions) {
    return await this.model.destroy(destroyOptions);
  }
  async findByPk(pk: string | number) {
    return await this.model.findByPk(pk);
  }
  async findOne(where: FindOptions) {
    return this.model.findOne(where);
  }
}
