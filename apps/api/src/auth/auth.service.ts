import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from '@finance/database';
import { RegisterDto, LoginDto } from './dto';
import { hashPassword, verifyPassword } from './utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(
    { email, password, firstName, lastName }: RegisterDto,
    response: Response,
  ) {
    // Check if user already exists
    const existingUser = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const user = await this.prismaService.users.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
      },
    });

    // Generate JWT token
    const token = this.generateJwtToken(user.id, user.email);

    // Set auth cookie
    this.setAuthCookie(response, token);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.created_at.toISOString(),
      },
      token, // Include token in response for mobile apps
      message: 'Registration successful',
    };
  }

  async login({ email, password }: LoginDto, response: Response) {
    // Find user by email
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateJwtToken(user.id, user.email);

    // Set auth cookie
    this.setAuthCookie(response, token);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.created_at.toISOString(),
      },
      token, // Include token in response for mobile apps
    };
  }

  async logout(response: Response) {
    this.clearAuthCookie(response);

    return { message: 'Logged out successfully' };
  }

  private generateJwtToken(userId: string, email: string): string {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwtService.sign(payload);
  }

  private setAuthCookie(response: Response, token: string) {
    const secure = this.configService.get('COOKIE_SECURE') === 'true';
    const sameSite = this.configService.get('COOKIE_SAME_SITE') as
      | 'lax'
      | 'strict'
      | 'none';
    const domain = this.configService.get('COOKIE_DOMAIN');
    const maxAge = parseInt(
      this.configService.get('COOKIE_MAX_AGE') || '604800000',
    ); // 7 days

    response.cookie('auth-token', token, {
      httpOnly: true,
      secure,
      sameSite,
      domain,
      maxAge,
      path: '/',
    });
  }

  private clearAuthCookie(response: Response) {
    const secure = this.configService.get('COOKIE_SECURE') === 'true';
    const sameSite = this.configService.get('COOKIE_SAME_SITE') as
      | 'lax'
      | 'strict'
      | 'none';
    const domain = this.configService.get('COOKIE_DOMAIN');

    response.clearCookie('auth-token', {
      httpOnly: true,
      secure,
      sameSite,
      domain,
      path: '/',
    });
  }
}
