import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OTP } from './model/otp.model';

@Module({
  imports: [SequelizeModule.forFeature([OTP])],
  providers: [OtpService],
  exports: [OtpService, SequelizeModule.forFeature([OTP])],
})
export class OtpModule {}
