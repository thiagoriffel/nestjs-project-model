import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { UsersController } from './users.controller';
import { SesmailModule } from 'src/sesmail/sesmail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]), 
    SesmailModule
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
