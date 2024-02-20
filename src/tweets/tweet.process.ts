import { Process, Processor } from '@nestjs/bull';
import { ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from 'bull';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Files } from 'src/user/entity/files.entity';

@Processor('tweet')
export class TweetProcess {
  constructor(@InjectModel(Files) private fileRepo: typeof Files) {}
  @Process('uploadImages')
  async uploadImage(job: Job) {
    await new Promise(async (res, rej) => {
      job.data.createReadStream().pipe(
        createWriteStream(
          join(process.cwd(), `src/uploads/${job.data.filename}`),
        )
          .on('finish', async () => {
            await this.fileRepo.create({
              userId: job.data.userId,
              fileLink: job.data.filename,
            });
            res(job.data.files.concat(job.data.filename));
          })
          .on('error', (err) => {
            rej(
              new ForbiddenException(
                `couldn't save img ${job.data.filename} ${err}`,
              ),
            );
          }),
      );
    });
  }
}
