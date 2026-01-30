import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { createMock } from '@golevelup/ts-jest';
import { PrismaService } from '@finance/database';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import * as passwordUtil from './utils/password.util';

jest.mock('./utils/password.util');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let mockResponse: jest.Mocked<Response>;

  const mockUser = {
    id: 'user-id-123',
    email: 'test@example.com',
    password: '$2b$10$hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-01T00:00:00Z'),
  };

  const mockToken = 'jwt-token-123';

  beforeEach(async () => {
    const mockPrismaService = {
      users: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    mockResponse = createMock<Response>();

    // Mock config service default values
    configService.get.mockImplementation((key: string) => {
      switch (key) {
        case 'COOKIE_SECURE':
          return 'false';
        case 'COOKIE_SAME_SITE':
          return 'lax';
        case 'COOKIE_DOMAIN':
          return 'localhost';
        case 'COOKIE_MAX_AGE':
          return '604800000';
        default:
          return undefined;
      }
    });

    // Mock JWT service
    jwtService.sign.mockReturnValue(mockToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should successfully register a new user', async () => {
      prismaService.users.findUnique.mockResolvedValue(null);
      prismaService.users.create.mockResolvedValue(mockUser);
      (passwordUtil.hashPassword as jest.Mock).mockResolvedValue(
        '$2b$10$hashedPassword',
      );

      const result = await service.register(registerDto, mockResponse);

      expect(prismaService.users.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });

      expect(passwordUtil.hashPassword).toHaveBeenCalledWith(
        registerDto.password,
      );

      expect(prismaService.users.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: '$2b$10$hashedPassword',
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
        },
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth-token',
        mockToken,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          domain: 'localhost',
          maxAge: 604800000,
          path: '/',
        }),
      );

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          createdAt: mockUser.created_at.toISOString(),
        },
        message: 'Registration successful',
      });
    });

    it('should register user without firstName and lastName', async () => {
      const dtoWithoutNames = {
        email: 'test@example.com',
        password: 'password123',
      };
      const userWithoutNames = {
        ...mockUser,
        firstName: null,
        lastName: null,
      };

      prismaService.users.findUnique.mockResolvedValue(null);
      prismaService.users.create.mockResolvedValue(userWithoutNames);
      (passwordUtil.hashPassword as jest.Mock).mockResolvedValue(
        '$2b$10$hashedPassword',
      );

      const result = await service.register(dtoWithoutNames, mockResponse);

      expect(prismaService.users.create).toHaveBeenCalledWith({
        data: {
          email: dtoWithoutNames.email,
          password: '$2b$10$hashedPassword',
          firstName: null,
          lastName: null,
        },
      });

      expect(result.user.firstName).toBeNull();
      expect(result.user.lastName).toBeNull();
    });

    it('should throw ConflictException when user already exists', async () => {
      prismaService.users.findUnique.mockResolvedValue(mockUser);

      await expect(service.register(registerDto, mockResponse)).rejects.toThrow(
        new ConflictException('User with this email already exists'),
      );

      expect(passwordUtil.hashPassword).not.toHaveBeenCalled();
      expect(prismaService.users.create).not.toHaveBeenCalled();
    });

    it('should throw error when password hashing fails', async () => {
      prismaService.users.findUnique.mockResolvedValue(null);
      (passwordUtil.hashPassword as jest.Mock).mockRejectedValue(
        new Error('Hashing failed'),
      );

      await expect(service.register(registerDto, mockResponse)).rejects.toThrow(
        'Hashing failed',
      );

      expect(prismaService.users.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login a user', async () => {
      prismaService.users.findUnique.mockResolvedValue(mockUser);
      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto, mockResponse);

      expect(prismaService.users.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });

      expect(passwordUtil.verifyPassword).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth-token',
        mockToken,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          domain: 'localhost',
          maxAge: 604800000,
          path: '/',
        }),
      );

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          createdAt: mockUser.created_at.toISOString(),
        },
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      prismaService.users.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(
        new UnauthorizedException('Invalid email or password'),
      );

      expect(passwordUtil.verifyPassword).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      prismaService.users.findUnique.mockResolvedValue(mockUser);
      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(
        new UnauthorizedException('Invalid email or password'),
      );

      expect(jwtService.sign).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should throw error when password verification fails', async () => {
      prismaService.users.findUnique.mockResolvedValue(mockUser);
      (passwordUtil.verifyPassword as jest.Mock).mockRejectedValue(
        new Error('Verification failed'),
      );

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(
        'Verification failed',
      );

      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should successfully logout and clear auth cookie', async () => {
      const result = await service.logout(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'auth-token',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          domain: 'localhost',
          path: '/',
        }),
      );

      expect(result).toEqual({
        message: 'Logged out successfully',
      });
    });
  });

  describe('cookie configuration', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    beforeEach(() => {
      prismaService.users.findUnique.mockResolvedValue(mockUser);
      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);
    });

    it('should use secure cookies when COOKIE_SECURE is true', async () => {
      configService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'COOKIE_SECURE':
            return 'true';
          case 'COOKIE_SAME_SITE':
            return 'lax';
          case 'COOKIE_DOMAIN':
            return 'localhost';
          case 'COOKIE_MAX_AGE':
            return '604800000';
          default:
            return undefined;
        }
      });

      await service.login(loginDto, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth-token',
        mockToken,
        expect.objectContaining({
          secure: true,
        }),
      );
    });

    it('should use custom sameSite setting', async () => {
      configService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'COOKIE_SECURE':
            return 'false';
          case 'COOKIE_SAME_SITE':
            return 'strict';
          case 'COOKIE_DOMAIN':
            return 'localhost';
          case 'COOKIE_MAX_AGE':
            return '604800000';
          default:
            return undefined;
        }
      });

      await service.login(loginDto, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth-token',
        mockToken,
        expect.objectContaining({
          sameSite: 'strict',
        }),
      );
    });

    it('should use custom domain', async () => {
      configService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'COOKIE_SECURE':
            return 'false';
          case 'COOKIE_SAME_SITE':
            return 'lax';
          case 'COOKIE_DOMAIN':
            return '.example.com';
          case 'COOKIE_MAX_AGE':
            return '604800000';
          default:
            return undefined;
        }
      });

      await service.login(loginDto, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth-token',
        mockToken,
        expect.objectContaining({
          domain: '.example.com',
        }),
      );
    });
  });
});
