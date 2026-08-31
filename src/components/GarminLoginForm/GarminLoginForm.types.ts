import type { z } from 'zod';
import type { credentialsSchema, mfaSchema } from './GarminLoginForm.constants';

export interface GarminLoginFormProps {
  onAuthenticated: () => void;
}

export type CredentialsFormValues = z.infer<typeof credentialsSchema>;
export type MfaFormValues = z.infer<typeof mfaSchema>;
