import { Process, Processor } from '@nestjs/bull';
import { ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from 'bull';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Files } from 'src/user/entity/files.entity';

@Processor('tweet')
export class TweetProcess {
  constructor() {}
  @Process('uploadImages')
  async uploadImage(job: Job) {}
}
