import { queryOptions } from '@tanstack/react-query';
import type { StravaSessionResponse } from '@/types/Strava';
import { apiConfig } from '../apiConfig';
import { apiRequest } from '../apiClient';

export const stravaSessionQueryKey = ['strava', 'session'] as const;

export function stravaSessionQueryOptions() {
  return queryOptions({
    queryKey: stravaSessionQueryKey,
    queryFn: () => apiRequest<StravaSessionResponse>(apiConfig.routes.strava.session),
  });
}
