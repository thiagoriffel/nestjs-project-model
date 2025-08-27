import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, password: string){

    const user = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const [salt, storeHash] = user.password.split('.')
    const hash = (await scrypt(password, salt, 32)) as Buffer

    if (storeHash != hash.toString('hex'))
      return new UnauthorizedException('Invalid Credentials')

    const payload = {
      name: user.name,
      email: user.email, 
      role: user.role
    }

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
