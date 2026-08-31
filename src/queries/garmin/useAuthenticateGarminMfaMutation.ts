import { useMutation } from '@tanstack/react-query';
import type { AuthenticateGarminMfaRequest } from '@/types/Garmin';
import { apiConfig } from '../apiConfig';
import { apiRequest } from '../apiClient';

export function useAuthenticateGarminMfaMutation() {
  return useMutation({
    mutationFn: (request: AuthenticateGarminMfaRequest) =>
      apiRequest<undefined>(apiConfig.routes.garmin.authenticateMfa, {
        method: 'POST',
        body: request,
      }),
  });
}
