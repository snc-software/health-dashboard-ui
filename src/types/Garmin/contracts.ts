export type GarminSessionStatus = 'authenticated' | 'unauthenticated';

export interface GarminSessionResponse {
  status: GarminSessionStatus;
  authenticatedAt?: string | null;
}

export interface AuthenticateGarminRequest {
  email: string;
  password: string;
}

export type AuthenticateGarminStatus = 'authenticated' | 'mfa_required';

export interface AuthenticateGarminResponse {
  status: AuthenticateGarminStatus;
  mfaSessionId?: string | null;
}

export interface AuthenticateGarminMfaRequest {
  mfaSessionId: string;
  code: string;
}
