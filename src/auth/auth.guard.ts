import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecrete: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector
  ) {
    this.jwtSecrete = this.configService.getOrThrow('JWT_SECRET')
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request = context.switchToHttp().getRequest()
    const token = this.extractToken(request)

    if (!token)
      throw new UnauthorizedException('No token')

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    ) || []

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.jwtSecrete
        }
      )

      const userRoles: string[] = Array.isArray(payload?.role)
        ? payload.role
        : payload?.role
        ? [payload.role]
        : [];

      // Se não houver requiredRoles configurados no decorator, qualquer usuário passa
      if (requiredRoles.length > 0) {
        const hasRole = userRoles.some((role: string) => requiredRoles.includes(role));
        if (!hasRole) {
          throw new UnauthorizedException('No permissions');
        }
      }

      request['user'] = payload
    } catch (error) {
      throw new UnauthorizedException(error?.message || error)
    }

    return true;
  }
  
  private extractToken(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? []

    return type === 'Bearer' ? token : undefined
  }
}
