import { EnumActionSendEmail } from 'src/core/enum';

export interface IOptionSendEmail {
  subject: string;
  mailTo: string[] | string;
  bcc?: string[];
  cc?: string[];
  contentMail: any;
  action: EnumActionSendEmail;
  images?: string[];
}
