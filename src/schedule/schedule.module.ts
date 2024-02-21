import { Module } from '@nestjs/common';
import { ScheduleService } from './shedule.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Files } from 'src/user/entity/files.entity';
import { BullModule } from '@nestjs/bull';
import { CronProcessor } from './schedule.consumer';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Files, User]),
    BullModule.registerQueue({
      configKey: 'config_queue',
      name: 'Cron',
    }),
  ],
  providers: [ScheduleService, CronProcessor],
  exports: [ScheduleService],
})
export class SchedulesModule {}
