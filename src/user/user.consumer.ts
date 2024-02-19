import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/mail/mail.service';
import { User } from './entity/user.entity';

@Processor('user')
export class ImageConsumer {
  constructor(private emailService: MailService) {}
  @Process('sendEmails')
  async sendEmails(job: Job<{ users: User[]; message: string }>) {
    job.data.users.map(async (l) => {
      await this.emailService.sendToAllUsers(l, job.data.message);
    });
    return 'process added to queue successfull';
  }
}
