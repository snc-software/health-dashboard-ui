import { useMutation } from '@tanstack/react-query';
import type { AuthenticateGarminRequest, AuthenticateGarminResponse } from '@/types/Garmin';
import { apiConfig } from '../apiConfig';
import { apiRequest } from '../apiClient';

export function useAuthenticateGarminMutation() {
  return useMutation({
    mutationFn: (request: AuthenticateGarminRequest) =>
      apiRequest<AuthenticateGarminResponse>(apiConfig.routes.garmin.authenticate, {
        method: 'POST',
        body: request,
      }),
  });
}
