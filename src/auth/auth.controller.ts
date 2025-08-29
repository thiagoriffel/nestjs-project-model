import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigInAuthDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() sigInAuthDTO: SigInAuthDTO) {
    return this.authService.signIn(sigInAuthDTO.email, sigInAuthDTO.password);
  }
}
