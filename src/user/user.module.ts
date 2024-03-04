import { Module, forwardRef } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserService } from './uesr.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserResolver } from './user.resolver';
import { HelpersModule } from 'src/common/utils/herlpers.modules';
import { OTP } from 'src/otp/model/otp.model';
import { OtpService } from 'src/otp/otp.service';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuards } from 'src/auth/guerd';
import { OtpModule } from 'src/otp/otp.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserGuard } from './guard';
import { SecurityGroub } from './entity/securityGroup.entity';
import { BullModule } from '@nestjs/bull';
import { ImageConsumer } from './user.consumer';
import { producerService } from './user.producer';
import { Files } from './entity/files.entity';
import { UserRepo } from './user.repo';
import { Tweets } from 'src/tweets/entities/tweet.entity';
import { DataloaderModule } from 'src/dataloader/dataloader.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { dataloaderInterceptor } from 'src/dataloader/dataloader.interceptor';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Tweets, OTP, SecurityGroub, Files]),
    HelpersModule,
    MailModule,
    forwardRef(() => AuthModule),
    ConfigModule,
    OtpModule,
    JwtModule.register({}),
    BullModule.registerQueue({
      configKey: 'config_queue',
      name: 'user',
    }),
    forwardRef(() => DataloaderModule),
  ],
  providers: [
    UserService,
    UserResolver,
    OtpService,
    ConfigService,
    AuthGuards,
    JwtService,
    UserGuard,
    ImageConsumer,
    producerService,
    UserRepo,
    {
      provide: APP_INTERCEPTOR,
      useClass: dataloaderInterceptor,
    },
  ],
  exports: [
    UserService,
    UserResolver,
    OtpService,
    ConfigService,
    UserGuard,
    UserRepo,
  ],
})
export class UserModule {}
