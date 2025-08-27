import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // secret: configService.getOrThrow('JWT_SECRET'),
        secret: process.env.JWT_SECRET,
        // signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRATION_TIME') },
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      })
    }),
    UsersModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
