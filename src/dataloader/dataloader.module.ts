import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tweets } from 'src/tweets/entities/tweet.entity';

@Module({
  imports: [SequelizeModule.forFeature([Tweets])],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
