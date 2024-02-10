import { ForbiddenException, Injectable } from '@nestjs/common';
import { OTP } from './model/otp.model';
import { Repository } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { OtpUseCase } from './otp.enum';

@Injectable()
export class OtpService {
  constructor(@InjectModel(OTP) private otpRepo: Repository<OTP>) {}
  async generateOTP(userId: string, useCase: OtpUseCase) {
    const code = Math.floor(10000000 + Math.random() * 90000000);
    const expireIn = new Date().setTime(new Date().getTime() + 60 * 60 * 1000);
    const OTP = await this.otpRepo.create({
      OTPCode: code,
      userId,
      useCase,
      expiration: expireIn,
    });

    return OTP;
  }
  async deleteOTP(code: number) {
    const otp = await this.otpRepo.findOne({ where: { OTPCode: code } });
    if (otp && otp.valide === true) {
      await otp.destroy();
    }
  }
  async findOneOTP(code: number) {
    const OTP = await this.otpRepo.findOne({ where: { OTPCode: code } });
    return OTP;
  }
}
