import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}

  async sendPassword(email: string, name: string, password: string) {
    await this.mailer.sendMail({
      to: email,
      subject: 'Conta criada :)',
      // text: `Olá ${name}, seu cadastro foi criado com sucesso.`,
      // html: `<p>Olá ${name}, seu cadastro foi criado com sucesso.</p><p>Sua senha ${password}</p>`,
      template: 'user-create',
      context: { name: name, password: password },
    });
  }

  async sendRaw(to: string, subject: string, text: string) {
    await this.mailer.sendMail({ to, subject, text });
  }
}