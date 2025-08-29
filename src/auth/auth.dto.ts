import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigInAuthDTO {
  @IsNotEmpty() @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}