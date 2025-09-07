import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { UsersController } from './users.controller';
import { MailSenderModule } from 'src/mailer/mailer.module';
import { SesmailModule } from 'src/sesmail/sesmail.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), MailSenderModule, SesmailModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
