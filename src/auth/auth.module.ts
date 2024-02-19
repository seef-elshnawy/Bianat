import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HelpersModule } from 'src/common/utils/herlpers.modules';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuards } from './guerd';
import { OtpModule } from 'src/otp/otp.module';
import { OtpService } from 'src/otp/otp.service';

@Module({
  imports: [
    HelpersModule,
    forwardRef(() => UserModule),
    MailModule,
    JwtModule.register({}),
    OtpModule,
  ],
  providers: [AuthService, ConfigService, AuthGuards, OtpService],
  exports: [AuthService, AuthGuards],
})
export class AuthModule {}
