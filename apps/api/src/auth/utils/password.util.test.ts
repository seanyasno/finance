import * as bcrypt from 'bcrypt';
import { hashPassword, verifyPassword } from './password.util';

jest.mock('bcrypt');

describe('Password Utility', () => {
  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password with bcrypt', async () => {
      const password = 'mySecurePassword123';
      const hashedPassword = '$2b$10$hashedPasswordExample';

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const result = await hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockedBcrypt.hash).toHaveBeenCalledTimes(1);
    });

    it('should handle different passwords', async () => {
      const password1 = 'password1';
      const password2 = 'password2';
      const hash1 = '$2b$10$hash1';
      const hash2 = '$2b$10$hash2';

      mockedBcrypt.hash
        .mockResolvedValueOnce(hash1 as never)
        .mockResolvedValueOnce(hash2 as never);

      const result1 = await hashPassword(password1);
      const result2 = await hashPassword(password2);

      expect(result1).toBe(hash1);
      expect(result2).toBe(hash2);
      expect(mockedBcrypt.hash).toHaveBeenCalledTimes(2);
    });

    it('should throw error if bcrypt fails', async () => {
      const password = 'password';
      const error = new Error('Hashing failed');

      mockedBcrypt.hash.mockRejectedValue(error);

      await expect(hashPassword(password)).rejects.toThrow('Hashing failed');
    });
  });

  describe('verifyPassword', () => {
    it('should return true for matching password', async () => {
      const password = 'myPassword123';
      const hashedPassword = '$2b$10$hashedPasswordExample';

      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await verifyPassword(password, hashedPassword);

      expect(result).toBe(true);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        hashedPassword,
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it('should return false for non-matching password', async () => {
      const password = 'wrongPassword';
      const hashedPassword = '$2b$10$hashedPasswordExample';

      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await verifyPassword(password, hashedPassword);

      expect(result).toBe(false);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        hashedPassword,
      );
    });

    it('should throw error if bcrypt fails', async () => {
      const password = 'password';
      const hashedPassword = '$2b$10$hash';
      const error = new Error('Comparison failed');

      mockedBcrypt.compare.mockRejectedValue(error);

      await expect(verifyPassword(password, hashedPassword)).rejects.toThrow(
        'Comparison failed',
      );
    });
  });
});
