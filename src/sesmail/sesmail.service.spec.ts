import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { SESClient } from '@aws-sdk/client-ses';
import { SesmailService } from './sesmail.service';
import { SesmailSendDTO } from './sesmail.dto';
import { ConfigService } from '@nestjs/config';

describe('SesmailService (SES)', () => {
  let service: SesmailService;
  let config: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        SesmailService,
        {
          provide: SESClient,
          useFactory: () =>
            new SESClient({
              region: process.env.AWS_REGION,
            }),
        },
      ],
    }).compile();

    service = module.get<SesmailService>(SesmailService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('deve enviar um e-mail de teste via SES', async () => {
    const to = config.get<string>('SES_REPLY_TO') || process.env.SES_REPLY_TO;
    if (!to) {
      throw new Error('SES_REPLY_TO não definido no .env para o teste');
    }

    const sesmailSendDTO = new SesmailSendDTO();
    sesmailSendDTO.to = to;
    sesmailSendDTO.subject = 'Teste SES (Jest)';
    sesmailSendDTO.text = 'Olá! Este é um e-mail de teste enviado pelo Amazon SES via NestJS.';
    sesmailSendDTO.html = '<p><b>Olá!</b> Este é um e-mail de teste enviado pelo <i>Amazon SES</i> via NestJS.</p>';

    const res = await service.send(sesmailSendDTO);

    console.log('✅ MessageId:', res);
    expect(res).toBeDefined();
  });
});