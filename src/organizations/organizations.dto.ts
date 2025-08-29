import { ApiProperty } from '@nestjs/swagger';
import { IsEnum,  IsInt,  IsOptional, IsString, Min  } from 'class-validator';
import { StatusEnum } from 'src/db/entities/enum/status.enum';

export class OrganizationsCreateDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  document: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status: string;
}

export class OrganizationsPaginationDTO {
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

export class OrganizationsUpdateDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @ApiProperty({ enum: StatusEnum, default: [StatusEnum.ACTIVE], isArray: true })
  @IsEnum(StatusEnum)
  status?: string;
}