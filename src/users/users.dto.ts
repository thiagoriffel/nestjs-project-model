import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsIn } from 'class-validator';
import { UserRole } from 'src/db/entities/user.entity';

export class CreateUsersDTO {
  @IsNotEmpty() @IsString()
  name: string;

  @IsNotEmpty() @IsEmail()
  email: string;

  @IsOptional()
  @IsIn([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER])
  role?: UserRole;
}