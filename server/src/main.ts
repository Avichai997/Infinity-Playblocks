import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';

import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/common';
import { setupSwagger } from '@/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(cookieParser());

  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.JWT_SECRET,
    getSessionIdentifier: (req) => req.ip || 'default',
    cookieName: '_csrf',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'] as string,
    skipCsrfProtection: (req) => {
      // Skip CSRF check for auth endpoints (login, register, csrf-token)
      const path = req.path;
      return (
        path.startsWith('/api/auth/login') ||
        path.startsWith('/api/auth/register') ||
        path.startsWith('/api/auth/csrf-token')
      );
    },
  });

  app.use(doubleCsrfProtection);

  // CORS configuration
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // API prefix
  app.setGlobalPrefix('api');

  setupSwagger(app);

  const port = process.env.SERVER_PORT || 3001;
  await app.listen(port);
  console.log(`Server is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
