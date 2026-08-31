import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const mfaSchema = z.object({
  code: z.string().min(1, 'Enter the verification code'),
});
