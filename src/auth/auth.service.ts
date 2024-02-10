import { ForbiddenException, Injectable, Session } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { HelperService } from 'src/common/utils/helpers.service';
import { UserDto } from 'src/user/dto';
import { UserService } from 'src/user/uesr.service';
import { OtpService } from 'src/otp/otp.service';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/Auth.dto';
import { OtpUseCase } from 'src/otp/otp.enum';
import { staticResponseMessage, staticResponseUser } from 'src/user/Response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userSrvice: UserService,
    private hashServise: HelperService,
    private otpService: OtpService,
    private mailService: MailService,
    private jwtService: JwtService,
    public Config: ConfigService,
  ) {}
  async signUp(dto: UserDto): Promise<staticResponseUser> {
    const user = await this.userSrvice.createUser(dto);

    const otp = await this.otpService.generateOTP(
      user.id,
      OtpUseCase.EMAIL_VERIFICATION,
    );
    await this.mailService.sendUserConfirmation(dto, otp.OTPCode);
    const response = {
      data: user,
      code: 201,
      status: 'OK',
    };
    return response;
  }
  async signIn(dto: AuthDto): Promise<staticResponseMessage> {
    const user = await this.userSrvice.findOneByEmail(dto.email);
    if (!user) {
      throw new ForbiddenException(
        'invalid credential',
      );
    }
    const hash = await this.hashServise.compare(dto.password, user.password);
    if (!hash) {
      throw new ForbiddenException('invalid credential');
    }
    const payload = { userId: user.id };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: 'supersecret829',
    });
    const response = {
      data: token,
      code: 200,
      status: 'OK',
    };
    return response;
  }
  async signOut(@Session() session: Record<string, any>): Promise<string> {
    session.authUser = null;
    return 'you are signed out from your accout';
  }
  async validateToken(token: string): Promise<User> {
    return await this.jwtService.verify(token, {
      secret: process.env.SECRET_JWT,
    });
  }
}
