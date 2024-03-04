import { Module, forwardRef } from '@nestjs/common';
import { TweetDataLoaderService } from './tweets-dataloader.service';
import { UserModule } from 'src/user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tweets } from 'src/tweets/entities/tweet.entity';
import { dataLoaderRegistry } from './dataloader.registery';
import { DiscoveryService } from '@nestjs/core';

@Module({
  imports: [forwardRef(() => UserModule), SequelizeModule.forFeature([Tweets])],
  providers: [dataLoaderRegistry,TweetDataLoaderService,DiscoveryService],
  exports: [dataLoaderRegistry,TweetDataLoaderService],
})
export class DataloaderModule {}
 