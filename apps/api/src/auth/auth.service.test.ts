import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { createMock } from '@golevelup/ts-jest';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';
import { RegisterDto, LoginDto } from './dto';

describe('AuthService', () => {
  let service: AuthService;
  let supabaseService: jest.Mocked<SupabaseService>;
  let configService: jest.Mocked<ConfigService>;
  let mockResponse: jest.Mocked<Response>;

  const mockSupabaseClient = {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  };

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    user_metadata: {
      first_name: 'John',
      last_name: 'Doe',
    },
    created_at: '2024-01-01T00:00:00Z',
  };

  const mockSession = {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SupabaseService,
          useValue: createMock<SupabaseService>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    supabaseService = module.get(SupabaseService);
    configService = module.get(ConfigService);
    mockResponse = createMock<Response>();

    supabaseService.getClient.mockReturnValue(mockSupabaseClient as any);

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

    it('should successfully register a user with session', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: {
          user: mockUser,
          session: mockSession,
        },
        error: null,
      });

      const result = await service.register(registerDto, mockResponse);

      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: registerDto.email,
        password: registerDto.password,
        options: {
          data: {
            first_name: registerDto.firstName,
            last_name: registerDto.lastName,
          },
        },
      });

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth-token',
        mockSession.access_token,
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
          firstName: mockUser.user_metadata.first_name,
          lastName: mockUser.user_metadata.last_name,
          createdAt: mockUser.created_at,
        },
        message: 'Registration successful',
      });
    });

    it('should successfully register a user without session (email verification required)', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: {
          user: mockUser,
          session: null,
        },
        error: null,
      });

      const result = await service.register(registerDto, mockResponse);

      expect(mockResponse.cookie).not.toHaveBeenCalled();
      expect(result.message).toBe(
        'Please check your email to verify your account',
      );
    });

    it('should throw BadRequestException when Supabase returns an error', async () => {
      const errorMessage = 'User already registered';
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: errorMessage },
      });

      await expect(service.register(registerDto, mockResponse)).rejects.toThrow(
        new BadRequestException(errorMessage),
      );
    });

    it('should throw BadRequestException when user registration fails', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null, session: mockSession },
        error: null,
      });

      await expect(service.register(registerDto, mockResponse)).rejects.toThrow(
        new BadRequestException('User registration failed'),
      );
    });

    it('should throw BadRequestException when user email is missing', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: {
          user: { ...mockUser, email: null },
          session: mockSession,
        },
        error: null,
      });

      await expect(service.register(registerDto, mockResponse)).rejects.toThrow(
        new BadRequestException('User email is required'),
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login a user', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: mockUser,
          session: mockSession,
        },
        error: null,
      });

      const result = await service.login(loginDto, mockResponse);

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: loginDto.email,
        password: loginDto.password,
      });

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth-token',
        mockSession.access_token,
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
          firstName: mockUser.user_metadata.first_name,
          lastName: mockUser.user_metadata.last_name,
          createdAt: mockUser.created_at,
        },
      });
    });

    it('should throw UnauthorizedException when Supabase returns an error', async () => {
      const errorMessage = 'Invalid login credentials';
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: errorMessage },
      });

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(
        new UnauthorizedException(errorMessage),
      );
    });

    it('should throw UnauthorizedException when session is null', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(
        new UnauthorizedException('Login failed'),
      );
    });

    it('should throw BadRequestException when user is null', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: mockSession },
        error: null,
      });

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(
        new BadRequestException('User registration failed'),
      );
    });

    it('should throw UnauthorizedException when user email is empty', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: { ...mockUser, email: '' },
          session: mockSession,
        },
        error: null,
      });

      await expect(service.login(loginDto, mockResponse)).rejects.toThrow(
        new UnauthorizedException('User email is required'),
      );
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
    it('should use secure cookies when COOKIE_SECURE is true', async () => {
      configService.get.mockImplementation((key: string) => {
        return key === 'COOKIE_SECURE' ? 'true' : 'localhost';
      });

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      await service.login(
        { email: 'test@example.com', password: 'password' },
        mockResponse,
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth-token',
        mockSession.access_token,
        expect.objectContaining({
          secure: true,
        }),
      );
    });

    it('should use custom sameSite setting', async () => {
      configService.get.mockImplementation((key: string) => {
        return key === 'COOKIE_SAME_SITE' ? 'strict' : 'localhost';
      });

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      await service.login(
        { email: 'test@example.com', password: 'password' },
        mockResponse,
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'auth-token',
        mockSession.access_token,
        expect.objectContaining({
          sameSite: 'strict',
        }),
      );
    });
  });
});
