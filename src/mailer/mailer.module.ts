import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EmailService } from './mailer.service';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';


@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: Number(config.get<string>('MAIL_PORT') ?? 587),
          secure: false,
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: config.get<string>('MAIL_FROM') ?? 'No Reply <noreply@example.com>',
        },
        template: {
          dir: join(__dirname, '../src/mailer/templates'),
          // adapter: new HandlebarsAdapter(),
          // dir: __dirname + '/../../project-model/src/mailer/templates',
          adapter: new PugAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class MailSenderModule {}