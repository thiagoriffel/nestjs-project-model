// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
import { SesmailPasswordSendDTO, SesmailSendDTO } from './sesmail.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

const resolveTemplatePath = (name: string) => {
  const candidates = [
    path.resolve(__dirname, 'templates', name),                                 // dist/sesmail/templates/*
    path.resolve(__dirname, '..', 'sesmail', 'templates', name),                 // when __dirname resolves to dist/
    path.resolve(process.cwd(), 'src', 'sesmail', 'templates', name),            // src path (dev)
    path.resolve(process.cwd(), 'sesmail', 'templates', name),                   // project root fallback
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(`Template not found. Tried: ${candidates.join(' | ')}`);
};

@Injectable()
export class SesmailService {
  private readonly from: string;
  private readonly replyTo?: string;

  constructor(private readonly ses: SESClient, cfg: ConfigService) {
    this.from = process.env.SES_FROM ?? ''
    this.replyTo = process.env.SES_REPLY_TO ?? ''
  }

  async send(sesmailSendDTO: SesmailSendDTO): Promise<string> {
    const input: SendEmailCommandInput = {
      Source: this.from,
      Destination: { ToAddresses: Array.isArray(sesmailSendDTO.to) ? sesmailSendDTO.to : [sesmailSendDTO.to] },
      ReplyToAddresses: this.replyTo ? [this.replyTo] : undefined,
      Message: {
        Subject: { Data: sesmailSendDTO.subject, Charset: 'UTF-8' },
        Body: {
          Html: sesmailSendDTO.html ? { Data: sesmailSendDTO.html, Charset: 'UTF-8' } : undefined,
          Text: sesmailSendDTO.text ? { Data: sesmailSendDTO.text, Charset: 'UTF-8' } : undefined,
        },
      },
    };

    const res = await this.ses.send(new SendEmailCommand(input));
    return res.MessageId!;
  }

  async sendPassword(email: string, name: string, password: string) {
    const filePath = resolveTemplatePath('user-create.hbs');
    const source = fs.readFileSync(filePath, 'utf8');
    const compiled = Handlebars.compile(source);
    const html = compiled({name, password});

    const input: SendEmailCommandInput = {
      Source: this.from,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: 'Conta criada :)', Charset: 'UTF-8' },
        Body: { Html: { Data: html, Charset: 'UTF-8' } },
      }

    }

    const res = await this.ses.send(new SendEmailCommand(input));
    return res.MessageId!;
  }
}