import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Queue } from 'bull';
import { unlink } from 'fs';
import { join } from 'path';
import { Op } from 'sequelize';
import { Files } from 'src/user/entity/files.entity';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class ScheduleService {
  constructor(
    private schedulerRejestery: SchedulerRegistry,
    @InjectModel(Files) private fileRepo: typeof Files,
    @InjectModel(User) private userRepo: typeof User,
    @InjectQueue('Cron') private addQue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON, { name: 'delete' })
  async deleteUnUsedFiles() {
    const files = await this.fileRepo.findAll({
      where: {
        isActive: false,
      },
    });
    if (files.length == 0) {
      this.schedulerRejestery.getCronJob('delete').stop();
    }
    this.addQue.add('deleteFiles', {
      files,
    });
  }
}
