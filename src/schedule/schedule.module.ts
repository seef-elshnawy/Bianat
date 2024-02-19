import { Module } from '@nestjs/common';
import { ScheduleService } from './shedule.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Files } from 'src/user/entity/files.entity';
import { BullModule } from '@nestjs/bull';
import { CronProcessor } from './schedule.consumer';

@Module({
  imports: [
    SequelizeModule.forFeature([Files]),
    BullModule.registerQueue({
      configKey: 'config_queue',
      name: 'Cron',
    }),
  ],
  providers: [ScheduleService, CronProcessor],
  exports: [ScheduleService],
})
export class SchedulesModule {}
