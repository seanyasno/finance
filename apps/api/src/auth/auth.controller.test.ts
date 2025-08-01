import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { createMock } from '@golevelup/ts-jest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let mockResponse: jest.Mocked<Response>;

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: '2024-01-01T00:00:00Z',
  };

  const mockAuthUser = {
    id: 'user-id',
    email: 'test@example.com',
    user_metadata: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    mockResponse = createMock<Response>();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockResult = {
        user: mockUser,
        message: 'Registration successful',
      };

      authService.register.mockResolvedValue(mockResult);

      const result = await controller.register(registerDto, mockResponse);

      expect(authService.register).toHaveBeenCalledWith(
        registerDto,
        mockResponse,
      );
      expect(result).toEqual({ user: mockResult });
    });

    it('should handle registration errors', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const error = new Error('Registration failed');
      authService.register.mockRejectedValue(error);

      await expect(
        controller.register(registerDto, mockResponse),
      ).rejects.toThrow(error);

      expect(authService.register).toHaveBeenCalledWith(
        registerDto,
        mockResponse,
      );
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResult = {
        user: mockUser,
      };

      authService.login.mockResolvedValue(mockResult);

      const result = await controller.login(loginDto, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(loginDto, mockResponse);
      expect(result).toEqual({ user: mockResult });
    });

    it('should handle login errors', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      authService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto, mockResponse)).rejects.toThrow(
        error,
      );

      expect(authService.login).toHaveBeenCalledWith(loginDto, mockResponse);
    });
  });

  describe('logout', () => {
    it('should successfully logout a user', async () => {
      const mockResult = { message: 'Logged out successfully' };
      authService.logout.mockResolvedValue(mockResult);

      const result = await controller.logout(mockResponse);

      expect(authService.logout).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user information', async () => {
      const result = await controller.getCurrentUser(mockAuthUser);

      expect(result).toEqual({ user: mockAuthUser });
    });

    it('should return null user when user is not provided', async () => {
      const result = await controller.getCurrentUser(null as any);

      expect(result).toEqual({ user: null });
    });

    it('should return null user when user is undefined', async () => {
      const result = await controller.getCurrentUser(undefined as any);

      expect(result).toEqual({ user: null });
    });
  });
});
