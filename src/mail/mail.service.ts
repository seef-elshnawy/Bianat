import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDto, token: number) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation',
      context: {
        name: user.fullName,
        token,
      },
    });
  }
  async sendToAllUsers(user: User, message: string) {
    await this.mailerService.sendMail({
      to: user.validEmail,
      subject: 'notffication from our website',
      template: './email',
      context: {
        name: user.fullName,
        message,
      },
    });
  }
}
