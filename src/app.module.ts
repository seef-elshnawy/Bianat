import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/entity/user.entity';
import { HelpersModule } from './common/utils/herlpers.modules';
import { OTP } from './otp/model/otp.model';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { handelError } from './common/utils/Error';
import { SecurityGroub } from './user/entity/securityGroup.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './user/user.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStroe from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SchedulesModule } from './schedule/schedule.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Files } from './user/entity/files.entity';
import { TweetsModule } from './tweets/tweets.module';
import { Tweets } from './tweets/entities/tweet.entity';
import { Hashtag } from './tweets/entities/hashtag.entity';
import { TweetHashtag } from './tweets/entities/tweetHash.entity';
import { PubServiceProvider } from './tweets/pubSub.provider';
import { DataloaderModule } from './dataloader/dataloader.module';
import { TweetDataLoaderService } from './dataloader/tweets-dataloader.service';
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      useFactory: (dataloaderService: TweetDataLoaderService) => {
        return {
          autoSchemaFile: true,
          playground: {
            settings: {
              'request.credentials': 'include',
            },
          },
          installSubscriptionHandlers: true,
          context: ({ req }) => ({
            req,
          }),
          formatError: (error) => {
            return handelError(error);
          },
        };
      },
      inject: [TweetDataLoaderService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      models: [User, OTP, SecurityGroub, Files, Tweets, Hashtag, TweetHashtag],
      autoLoadModels: false,
      synchronize: false,
      username: 'postgres',
      password: '12345678',
      database: 'postgres',
      host: 'localhost',
      port: 5432,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStroe,
      host: 'localhost',
      port: 6379,
    }),
    BullModule.forRoot('config_queue', {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(`${process.cwd()}/src/uploads`),
      serveRoot: '/public',
    }),
    ScheduleModule.forRoot(),
    UserModule,
    HelpersModule,
    MailModule,
    AuthModule,
    OtpModule,
    SchedulesModule,
    TweetsModule,
    DataloaderModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
