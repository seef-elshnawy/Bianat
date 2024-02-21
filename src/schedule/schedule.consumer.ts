import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from 'bull';
import { unlink } from 'fs';
import { join } from 'path';
import { Files } from 'src/user/entity/files.entity';

@Processor('Cron')
export class CronProcessor {
  constructor(@InjectModel(Files) private fileRepo: typeof Files) {}
  @Process('deleteFiles')
  async uploadFiles(job: Job<{ files: Files[] }>) {
    job.data.files.map((l) => {
      unlink(
        join(`${process.cwd()}/src/uploads/${l.fileLink}`),
        async (err) => {
          if (err) {
            if (err.code === 'ENOENT') console.log('file is not exist');
            else {
              throw err;
            }
          } else {
            await this.fileRepo.destroy({
              where: {
                id: l.id,
              },
            });
          }
        },
      );
    });
  }
}
