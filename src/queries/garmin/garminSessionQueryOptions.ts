import { queryOptions } from '@tanstack/react-query';
import type { GarminSessionResponse } from '@/types/Garmin';
import { apiConfig } from '../apiConfig';
import { apiRequest } from '../apiClient';

export const garminSessionQueryKey = ['garmin', 'session'] as const;

export function garminSessionQueryOptions() {
  return queryOptions({
    queryKey: garminSessionQueryKey,
    queryFn: () => apiRequest<GarminSessionResponse>(apiConfig.routes.garmin.session),
  });
}
