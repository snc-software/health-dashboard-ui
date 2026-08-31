import { queryOptions } from '@tanstack/react-query';
import type { DailyHealthStat } from '@/types/HealthStats';
import { apiConfig } from '../apiConfig';
import { apiRequest } from '../apiClient';

export const dailyHealthStatsQueryKey = (startDate: string, endDate: string) =>
  ['healthStats', 'daily', startDate, endDate] as const;

export function dailyHealthStatsQueryOptions(startDate: string, endDate: string) {
  return queryOptions({
    queryKey: dailyHealthStatsQueryKey(startDate, endDate),
    queryFn: () =>
      apiRequest<DailyHealthStat[]>(apiConfig.routes.healthStats.daily(startDate, endDate)),
  });
}
