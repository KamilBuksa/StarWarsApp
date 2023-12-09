import { Module } from '@nestjs/common';
import { MailService } from './services/mailer.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MyMailerModule {}
