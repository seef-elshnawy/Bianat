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
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      context: ({ req }) => ({ req }),

      formatError: (error) => {
        return handelError(error);
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      models: [User, OTP, SecurityGroub, Files],
      autoLoadModels: true,
      synchronize: true,
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
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
