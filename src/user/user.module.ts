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

@Module({
  imports: [
    SequelizeModule.forFeature([User, OTP]),
    HelpersModule,
    MailModule,
    forwardRef(() => AuthModule),
    ConfigModule,
    OtpModule,
    JwtModule.register({}),
  ],
  providers: [
    UserService,
    UserResolver,
    OtpService,
    ConfigService,
    AuthGuards,
    JwtService,
  ],
  exports: [UserService, UserResolver, OtpService, ConfigService],
})
export class UserModule {}
