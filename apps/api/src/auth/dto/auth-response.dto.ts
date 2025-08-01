import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UserResponseSchema = z.object({
  user: z
    .object({
      id: z.string(),
      email: z.string(),
      firstName: z.string().nullable().optional(),
      lastName: z.string().nullable().optional(),
      createdAt: z.string().optional(),
    })
    .nullable(),
});

export const AuthResponseSchema = z.object({
  user: z
    .object({
      id: z.string(),
      email: z.string(),
      firstName: z.string().nullable().optional(),
      lastName: z.string().nullable().optional(),
      createdAt: z.string().optional(),
    })
    .nullable()
    .optional(),
  message: z.string().optional(),
});

export const MessageResponseSchema = z.object({
  message: z.string(),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
export class AuthResponseDto extends createZodDto(AuthResponseSchema) {}
export class MessageResponseDto extends createZodDto(MessageResponseSchema) {}
