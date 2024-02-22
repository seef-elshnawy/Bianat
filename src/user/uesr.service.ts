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
import { ConfigService } from '@nestjs/config';
import { SecurityGroub } from './entity/securityGroup.entity';
import { Actions, Role } from './user.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ImageUploader } from 'src/common/utils/utils';
import { ReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { FileUpload } from 'graphql-upload';
import sharp from 'sharp';
import { Files } from './entity/files.entity';
import { UserRepo } from './user.repo';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepo,
    @InjectModel(SecurityGroub) private primissonsRepo: typeof SecurityGroub,
    @InjectModel(Files) private filesRepo: typeof Files,
    private helpers: HelperService,
    private otpService: OtpService,
    private hashService: HelperService,
    private mailService: MailService,
    private jwt: JwtService,
    private config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
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
  async giveUserSecurityGroup(userId: string, premissions: string[]) {
    const premissons = await this.primissonsRepo.findOne({
      where: { userId },
      include: [{ model: User }],
    });
    if (!premissons)
      return {
        data: await this.primissonsRepo.create({
          userId: userId,
          premissons: premissions,
        }),
      };
    else await this.updatePrimissons(premissions, userId);
    return { data: premissons.user };
  }
  async updatePrimissons(premissons: string[], userId: string) {
    const Premissions = await this.primissonsRepo.findOne({
      where: { userId },
    });
    const list = Premissions.premissons.concat(premissons);
    await Premissions.update({ premissons: list });
    return { data: 'premissions updated successfully' };
  }
  async findOneByEmail(email: any) {
    const user = await this.userRepo.findOne({
      where: { validEmail: email },
    });
    return user;
  }
  async findOneById(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      include: [{ model: SecurityGroub }],
    });

    if (!user) {
      throw new ForbiddenException('user not found');
    }
    return user;
  }
  async removeUser(id: string) {
    const user = await this.userRepo.remove({ where: { id } });
    if (!user) {
      throw new ForbiddenException('user not found');
    }
    return user;
  }
  async updateUser(id: string, dto: UserDto) {
    const user = await this.userRepo.findByPk(id);
    await user.update({ fullName: dto.fullName, age: dto.age });
    return user;
  }
  async getAllUser(page: number, limit: number) {
    const count = (await this.userRepo.findAll()).length;
    const users = await this.userRepo.findPaginate(page, limit, {
      page,
      limit,
      hasNext: count > page * limit,
      hasPrevious: page > 1,
      totalCount: count,
    });
    return users;
  }

  async validation(otp: OTP) {
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
        return { data: token };
    }
  }
  async validateOtp(code: number) {
    const otp = await this.otpService.findOneOTP(code);
    if (!otp || otp.expiration <= Date.now())
      throw new ForbiddenException('OTP is invalid');
    return this.validation(otp);
  }
  async emailVerification(userId: string) {
    const user = await this.userRepo.findByPk(userId);
    await user.update({ validEmail: user.invalidEmail, invalidEmail: null });
    return { data: 'email verified successfull' };
  }
  async ForgetPassword(email: String) {
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
    // return 'otp is sent to your email';
    return { data: 'otp is sent to your email' };
  }
  async ResetPassword(password: string, confirmPassword: string, user) {
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
    return { data: 'password updated successfull' };
  }
  async validateToken(token: string): Promise<User> {
    const payload = await this.jwt.verify(token, {
      secret: await this.config.get('SECRET_JWT'),
    });
    const user = await this.findOneById(payload.userId);
    return user;
  }
  async streamToBuffer(stream) {
    const chunks = [];
    return new Promise((res, rej) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('err', (err) => rej(err));
      stream.on('end', () => res(Buffer.concat(chunks)));
    });
  }
  async addImage(Image: FileUpload, userId: string) {
    console.log(Image);
    if (Image) {
      const { createReadStream, filename } = await Image;
      const newFileName = filename.replace(
        filename.split('.')[0],
        `${filename.split('.')[0]}${Math.random() * 100000000}`,
      );
      return await new Promise(async (res, rej) => {
        createReadStream().pipe(
          createWriteStream(join(process.cwd(), `src/uploads/${newFileName}`))
            .on('finish', async () => {
              await this.filesRepo.create({
                userId,
                fileLink: newFileName,
              });
              res({ data: `public/${newFileName}` });
            })
            .on('error', (err) => {
              rej(new ForbiddenException(`Could not save image ${err}`));
            }),
        );
      });
    } else {
      throw new ForbiddenException('Image is not defined');
    }
  }
  async Follow(userId: string, targetUserId: string) {
    const targerUser = await this.userRepo.findByPk(targetUserId);
    if (!targerUser) {
      throw new ForbiddenException('user is not found');
    }
    const user = await this.userRepo.findByPk(userId);
    const Followers = targerUser.Followers.concat(user.id);
    const Followings = user.Followings.concat(targerUser.id);
    await targerUser.update({
      Followers,
    });
    return {
      data: await user.update({
        Followings,
      }),
    };
  }

  async addHobbies(hobbie: string, userId: string) {
    const user = await this.findOneById(userId);
    if (user.Hobbies.length > 0) {
      const hobbiesList = user.Hobbies.concat(hobbie);
      await user.update({
        Hobbies: hobbiesList,
      });
    }
    await user.update('Hobbies', [hobbie]);
    await user.save();
    return { data: user };
  }
}
