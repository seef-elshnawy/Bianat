import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsResolver } from './tweets.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tweets } from './entities/tweet.entity';
import { User } from 'src/user/entity/user.entity';
import { HelpersModule } from 'src/common/utils/herlpers.modules';
import { UserModule } from 'src/user/user.module';
import { BullModule } from '@nestjs/bull';
import { Files } from 'src/user/entity/files.entity';
import { Hashtag } from './entities/hashtag.entity';
import { PubServiceProvider } from './pubSub.provider';
import { tweetSubResolver } from './tweet.subscription';

@Module({
  imports: [
    SequelizeModule.forFeature([Tweets, User, Files, Hashtag]),
    BullModule.registerQueue({
      configKey: 'config_queue',
      name: 'tweet',
    }),
    HelpersModule,
    UserModule,
  ],
  providers: [
    TweetsResolver,
    TweetsService,
    PubServiceProvider,
    tweetSubResolver,
  ],
})
export class TweetsModule {}
