import {
  ConsoleLogger,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from './dto';
import bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { HelperService } from 'src/common/utils/helpers.service';
import { OtpService } from 'src/otp/otp.service';
import { AuthDto } from 'src/auth/dto/Auth.dto';
import { OtpUseCase } from 'src/otp/otp.enum';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { WhereOptions } from 'sequelize';
import { OTP } from 'src/otp/model/otp.model';
import {
  staticResponseMessage,
  staticResponseUser,
  staticResponseUsers,
} from './Response';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    private helpers: HelperService,
    private otpService: OtpService,
    private hashService: HelperService,
    private mailService: MailService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async createUser(dto: UserDto): Promise<User> {
    const email = await this.userRepo.findOne({
      where: { validEmail: dto.email },
    });
    if (email) throw new ForbiddenException('email was already used');
    const hash = await this.helpers.encrypt(dto.password);
    const user = await this.userRepo.create({
      invalidEmail: dto.email,
      password: hash,
      fullName: dto.fullName,
      age: dto.age,
    });
    return user;
  }
  async findOneByEmail(email: any) {
    console.log(email, 'email');
    const user = await this.userRepo.findOne({
      where: { validEmail: email },
    });
    return user;
  }
  async findOneById(id: string) {
    const user = await this.userRepo.findByPk(id);

    if (!user) {
      throw new ForbiddenException('user not found');
    }
    return user;
  }
  async removeUser(id: string): Promise<staticResponseMessage> {
    const user = this.userRepo.destroy({ where: { id } });
    if (!user) {
      throw new ForbiddenException('user not found');
    }
    const response = {
      data: 'user deleted successfull',
      code: 200,
      status: 'ok',
    };
    return response;
  }
  async updateUser(id: string, dto: UserDto): Promise<staticResponseUser> {
    const user = await this.userRepo.findByPk(id);
    await user.update(dto);
    const response = {
      data: user,
      code: 200,
      status: 'ok',
    };
    return response;
  }
  async getAllUser(page: number): Promise<staticResponseUsers> {
    const user = await this.userRepo.findAll({
      offset: (page - 1) * 3,
      limit: 3,
      subQuery: false,
      order: [
        ['id', 'ASC'],
        ['fullName', 'DESC'],
      ],
    });
    console.log(user);
    const response = {
      data: user,
      code: 200,
      status: 'OK',
    };
    return response;
  }

  async findUserOrError(
    where: WhereOptions<User>,
    error?: string,
  ): Promise<staticResponseUser> {
    const user = await this.userRepo.findOne({ where });
    if (!user) throw new NotFoundException(error ?? 'User Not Found');
    const response = {
      data: user,
      code: 200,
      status: 'ok',
    };
    return response;
  }

  async validation(otp: OTP): Promise<staticResponseMessage> {
    switch (otp.useCase) {
      case OtpUseCase.EMAIL_VERIFICATION:
        await this.otpService.deleteOTP(otp.OTPCode);
        return await this.emailVerification(otp.userId);
      case OtpUseCase.PASSWORD_VERIFICATION:
        const token = this.jwt.sign(
          { userId: otp.userId },
          { secret: await this.config.get('SECRET_JWT'), expiresIn: '30d' },
        );
        await this.otpService.deleteOTP(otp.OTPCode);
        const response = {
          data: token,
          code: 200,
          status: 'OK',
        };
        return response;
    }
  }
  async validateOtp(code: number): Promise<staticResponseMessage> {
    const otp = await this.otpService.findOneOTP(code);
    if (!otp || otp.expiration <= Date.now())
      throw new ForbiddenException('OTP is invalid');
    return this.validation(otp);
  }
  async emailVerification(userId: string) {
    const user = await this.userRepo.findByPk(userId);
    await user.update({ validEmail: user.invalidEmail, invalidEmail: null });
    const response = {
      data: 'email verified successfull',
      code: 200,
      status: 'OK',
    };
    return response;
  }
  async ForgetPassword(email: String): Promise<staticResponseMessage> {
    const user = await this.findOneByEmail(email);
    if (!user) throw new ForbiddenException('This account is invalid');
    const otp = await this.otpService.generateOTP(
      user.id,
      OtpUseCase.PASSWORD_VERIFICATION,
    );
    const dto = {
      email: user.validEmail,
      fullName: user.fullName,
      password: user.password,
      age: user.age,
    };
    await this.mailService.sendUserConfirmation(dto, otp.OTPCode);
    const response = {
      data: 'Reset code sent to you',
      code: 200,
      status: 'ok',
    };
    return response;
  }
  async ResetPassword(
    password: string,
    confirmPassword: string,
    token: string,
  ) {
    console.log(this.config.get('SECRET_JWT'));

    const payload = await this.jwt.verify(token, {
      secret: await this.config.get('SECRET_JWT'),
    });
    console.log(payload);
    const user = await this.findOneById(payload.userId);
    if (!user) return new ForbiddenException('This account is not valid');
    const checkPassword = await this.hashService.compare(
      password,
      user.password,
    );
    if (checkPassword)
      throw new ForbiddenException(
        'this password is equal to previous password please use another one or going back to signin',
      );
    if (password !== confirmPassword)
      throw new ForbiddenException("confirm password didn't equal password");
    const hash = await this.hashService.encrypt(password);
    if (!user) throw new ForbiddenException('OTP is invalid');
    await user.update({ password: hash });
    const response = {
      data: 'password updated successfull',
      code: 200,
      status: 'ok',
    };
    return response;
  }
}
