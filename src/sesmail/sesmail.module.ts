import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SESClient } from '@aws-sdk/client-ses';
import { fromEnv } from '@aws-sdk/credential-providers';
import { SesmailService } from './sesmail.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    SesmailService,
    {
      provide: SESClient,
      useFactory: (cfg: ConfigService) =>
        new SESClient({
          region: process.env.AWS_REGION,
          credentials:
            process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
              ? fromEnv()
              : undefined,
        }),
      inject: [ConfigService],
    },
  ],
  exports: [SesmailService],
})

export class SesmailModule {}