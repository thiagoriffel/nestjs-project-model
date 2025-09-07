import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SesmailSendDTO {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsString()
  text?: string;

}

export class SesmailPasswordSendDTO {
  @IsEmail()
  to: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  constructor(to: string, name: string, password: string) {
    this.to = to;
    this.name = name;
    this.password = password;
  }
}