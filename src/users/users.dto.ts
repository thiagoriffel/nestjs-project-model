import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { StatusEnum } from 'src/db/entities/enum/status.enum';
import { UserRoleEnum } from 'src/db/entities/enum/user.enum';

export class UsersCreateDTO {
  @IsNotEmpty() @IsString()
  name: string;

  @IsNotEmpty() @IsEmail()
  email: string;

  @IsOptional()
  @ApiProperty({ enum: UserRoleEnum, default: UserRoleEnum.USER })
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum

  @IsNotEmpty()
  organization_id: string;
}

export class UserPaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  q?: string;
}
export class UsersUpdateDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  document: string;

  @IsOptional()
  @ApiProperty({ enum: StatusEnum, default: [StatusEnum.ACTIVE], isArray: true })
  @IsEnum(StatusEnum)
  status?: string;
}