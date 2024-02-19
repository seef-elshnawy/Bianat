import { InjectQueue } from '@nestjs/bull';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { User } from './entity/user.entity';
import { UserService } from './uesr.service';
import { InjectModel } from '@nestjs/sequelize';
import { ImageUploader } from 'src/common/utils/utils';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Op } from 'sequelize';
@Injectable()
export class producerService {
  constructor(
    @InjectQueue('user') private addQue: Queue,
    @InjectModel(User) private userRepo: typeof User,
  ) {}

  async sendEmails(message: string) {
    const activeUsers = await this.userRepo.findAll({
      where: { validEmail: { [Op.ne]: null } },
    });
    await this.addQue.add('sendEmails', {
      users: activeUsers,
      message,
    });
    return {
      data: 'progress added to queue successfull',
    };
  }
}
