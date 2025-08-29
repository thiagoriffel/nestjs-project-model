import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { MailSenderModule } from './mailer/mailer.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DbModule,
    UsersModule,
    MailSenderModule,
    OrganizationsModule
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}