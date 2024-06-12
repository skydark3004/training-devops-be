import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IOptionSendEmail } from './email.interface';
//import { EnumActionSendEmail } from 'src/core/enum';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail(params: IOptionSendEmail) {
    const options: ISendMailOptions = {
      subject: params.subject,
      to: params.mailTo,
      bcc: params.bcc,
      cc: params.cc,
      context: params.contentMail,
    };

    /*     switch (params.action) {
      case EnumActionSendEmail.INFORM_ERROR_FOR_OWNER:
        options.template = 'error.ejs';
        break;
      case EnumActionSendEmail.INFORM_MESSAGE_FOR_OWNER:
        options.template = 'inform-message.ejs';
        break;
    } */
    await this.mailService.sendMail(options);
  }
}
