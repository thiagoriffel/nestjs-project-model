import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsIn } from 'class-validator';
import { UserRole } from 'src/db/entities/user.entity';

export class UsersDTO {
  @IsNotEmpty() @IsString()
  name: string;

  @IsNotEmpty() @IsEmail()
  email: string;

  @IsOptional() @ApiProperty({ enum: UserRole, default: [UserRole.USER], isArray: true })
  @IsIn([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER])
  role?: UserRole;
}