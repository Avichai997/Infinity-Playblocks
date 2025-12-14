import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;

    // Skip CSRF check for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return true;
    }

    // Skip CSRF check for auth endpoints (login, register, csrf-token)
    if (
      request.path.startsWith('/api/auth/login') ||
      request.path.startsWith('/api/auth/register') ||
      request.path.startsWith('/api/auth/csrf-token')
    ) {
      return true;
    }

    const csrfToken = request.headers['x-csrf-token'] as string;
    const cookieToken = request.cookies?.['csrf-token'];

    if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
      throw new UnauthorizedException('Invalid CSRF token');
    }

    return true;
  }
}
