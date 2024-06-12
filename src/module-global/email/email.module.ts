import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { APP_CONFIG } from 'src/configs/app.config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: APP_CONFIG.ENV.MAIL_CONFIG.GMAIL.CONFIG.host,
          secure: true,
          auth: {
            user: APP_CONFIG.ENV.MAIL_CONFIG.GMAIL.CONFIG.auth.user,
            pass: APP_CONFIG.ENV.MAIL_CONFIG.GMAIL.CONFIG.auth.pass,
          },
        },
        defaults: {
          from: APP_CONFIG.ENV.MAIL_CONFIG.FROM,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModuleGlobal {}
